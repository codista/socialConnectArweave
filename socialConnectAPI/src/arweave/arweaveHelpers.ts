import {ArweaveTagNames,UserData} from './dataTypes';
import { and, or, equals } from 'arql-ops';
import {ethers} from "ethers"

//fetch detailed tx information from a list of transaction ids as json
export async function expandTransactions(tx_ids: string[], ar: any): Promise<any> {
    let res = new Array();
    let tx: any;
    for(var i=0;i<tx_ids.length;i++) {
        try {
            tx = await ar.transactions.get(tx_ids[i]);
            let txJson = tx.toJSON();

            //decode tags and add to json
            let tags = tx.get('tags');
            for(var j=0;j<tags.length;j++) {
                let key = tags[j].get('name', {decode: true, string: true});
                let value = tags[j].get('value', {decode: true, string: true});
                txJson[key] =value;
                //console.log(`got pair ${key} and ${value}`); 
            }
            //console.log("got transaction tx "+JSON.stringify(txJson));    
            res.push(txJson);
        }
        catch(err) {console.error("failed at expand tx "+tx_ids[i]+err,err)}    
    }

    return res;
}

export async function waitForConfirmation(txId: string, ar: any) {
    let startTime: number=Date.now(),currTime: number=Date.now();
    //wait up to 15 minutes for confirmation then bail.
    let resp = await ar.transactions.getStatus(txId);
    let curr10sec = 0;
    while ('status' in resp && (resp.status==200 || resp.status==202 || resp.status==404) && resp.confirmed==null && (currTime-startTime)<1000*60*45) { 
        try {
            resp = await ar.transactions.getStatus(txId);
            let tensec = Math.floor((currTime-startTime)/10000);
            if (tensec>curr10sec) {
                curr10sec=tensec;
                console.log(`waiting for confirmation. response is ${JSON.stringify(resp)} time laspe: ${curr10sec*10} seconds`);
            }
            currTime=Date.now();
        } catch(err) {
            console.error("get status error "+err.message)
        }
    }
    if (('status' in resp) && resp.status ==200 && ('confirmed' in resp) && resp.confirmed!=null && ('number_of_confirmations' in resp.confirmed) && resp.confirmed.number_of_confirmations>0) {
        console.log(`success waiting for confirmed transaction. id: ${txId} response: ${JSON.stringify(resp)} time laspe: ${(currTime-startTime)/1000} seconds`)
        return true;
    }
    else {
        console.error(`failed waiting for confirmed transaction. id: ${txId} response: ${JSON.stringify(resp)} time laspe: ${(currTime-startTime)/1000} seconds`);
        return false;
    }
}


export async function submitAndWaitForConfirmation(tx: any, ar: any,bWait: boolean,testar: any) {

    let resp = await ar.transactions.post(tx);
    console.log(`submitted. response is ${JSON.stringify(resp)} `);
    if (resp.status!=200) {
        console.error(`submit trasaction failed returned status ${resp.status}`)
    }
    if (testar) {
        console.log('before mine');
        await testar.mine();
        console.log('after mine');
    }
    if (!bWait) {
        return true;
    }

    return await waitForConfirmation(tx.id,ar);
}

//returns the last transaction based on the createdBy tag
export function getLatest(txs: any) {
    txs.sort((a,b) => (a[ArweaveTagNames.createdDate] > b[ArweaveTagNames.createdDate]) ? 1 : ((a[ArweaveTagNames.createdDate] < b[ArweaveTagNames.createdDate]) ? -1 : 0));
    return txs[txs.length-1];
}

export async function getFollowings(address: string, namespace: string, ar: any,walletAddress: string) {
    //get all follow transactions whos source is this address.
    const myQuery =and(equals('from', walletAddress),
            equals(ArweaveTagNames.source,address),
            equals(ArweaveTagNames.nameSpace,namespace),
    );
    console.log(`query is ${JSON.stringify(myQuery)}`)
    const results = await ar.arql(myQuery);

    let expandedTxs = await expandTransactions(results, ar);
    let TxsMap = mapLatestTxs(expandedTxs,ArweaveTagNames.connTarget);
    let users = TxsToUserData(TxsMap,ArweaveTagNames.connTarget);

    return users;
}



export async function getFollowers(address: string, addressType: string,namespace: string, ar: any,walletAddress: string) {
    //get all follow transactions whos target is this address.
    const myQuery =and(equals('from', walletAddress),
            equals(ArweaveTagNames.connTarget,address),
            equals(ArweaveTagNames.targetType,addressType),
            equals(ArweaveTagNames.nameSpace,namespace),
    );
    console.log(`query is ${JSON.stringify(myQuery)}`)
    const results = await ar.arql(myQuery);

    let expandedTxs = await expandTransactions(results, ar);
    //console.log(`expanded txs is : ${JSON.stringify(expandedTxs)}`);
    let TxsMap = mapLatestTxs(expandedTxs,ArweaveTagNames.source);
    //console.log(`transactionmap is: ${JSON.stringify(TxsMap)} length is ${Object.keys(TxsMap).length}`);
    let users = TxsToUserData(TxsMap,ArweaveTagNames.source);

    return users;
}

function txToUser(tx: any,whichUser: string) {
    let ret: UserData = {address:'',addressType:'Eth',alias:'',status:'Confirmed'};
    if (whichUser==ArweaveTagNames.source) {
        ret.address = tx[ArweaveTagNames.source];
        ret.addressType = "Eth";
        ret.alias = "";
    }
    else {
        ret.address = tx[ArweaveTagNames.connTarget];
        ret.addressType = tx[ArweaveTagNames.targetType];
        ret.alias = tx[ArweaveTagNames.alias];
        ret.status = "Confirmed";
    }
    return ret;
}

export function TxsToUserData(TxsMap, whichUser: string) {
    var users = new Array();
    let keys = Object.keys(TxsMap);
    for (var i=0;i<keys.length;i++) {
        if (TxsMap[keys[i]][ArweaveTagNames.connType] =="Follow") {
            users.push(txToUser(TxsMap[keys[i]],whichUser))     
        }
    }
    return users;
}

export function validateSignedMessage(signedMessage: string, message: string, address: string): boolean {
    let signerAddr = ethers.utils.verifyMessage(message,signedMessage);
    return (signerAddr===address);
}

export function mapLatestTxs(txs, mapBy: string): Object {
    var mp= new Object();
    for (var i=0;i<txs.length;i++) {
        let currKey = txs[i][mapBy];
        if ((currKey in mp ==false) || mp[currKey][ArweaveTagNames.createdDate]<txs[i][ArweaveTagNames.createdDate]) {
            mp[currKey] = txs[i];
            //console.log(`just set ${txs[i][ArweaveTagNames.source]}  to ${JSON.stringify(mp[txs[i][ArweaveTagNames.source]])}`)
        }
    }
    //console.log(`transactionmap is: ${JSON.stringify(mp)} `);
    return mp;
}



