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

//returns the last transaction based on the createdBy tag
export function getLatest(txs: any) {
    txs.sort((a,b) => (a[ArweaveTagNames.createdDate] > b[ArweaveTagNames.createdDate]) ? 1 : ((a[ArweaveTagNames.createdDate] < b[ArweaveTagNames.createdDate]) ? -1 : 0));
    return txs[txs.length-1];
}

export async function getFollowings(address: string, namespace: string, ar: any) {
    //get all follow transactions whos source is this address.
    const myQuery =and(equals('from', process.env.ARWEAVE_ADDRESS),
            equals(ArweaveTagNames.source,address),
            equals(ArweaveTagNames.nameSpace,namespace),
    );
    const results = await ar.arql(myQuery);

    let expandedTxs = await expandTransactions(results, ar);
    let TxsMap = mapLatestTxs(expandedTxs,ArweaveTagNames.connTarget);
    let users = TxsToUserData(TxsMap,ArweaveTagNames.connTarget);

    return users;
}

export async function getFollowers(address: string, addressType: string,namespace: string, ar: any) {
    //get all follow transactions whos target is this address.
    const myQuery =and(equals('from', process.env.ARWEAVE_ADDRESS),
            equals(ArweaveTagNames.connTarget,address),
            equals(ArweaveTagNames.targetType,addressType),
            equals(ArweaveTagNames.nameSpace,namespace),
    );
    const results = await ar.arql(myQuery);

    let expandedTxs = await expandTransactions(results, ar);
    //console.log(`expanded txs is : ${JSON.stringify(expandedTxs)}`);
    let TxsMap = mapLatestTxs(expandedTxs,ArweaveTagNames.source);
    //console.log(`transactionmap is: ${JSON.stringify(TxsMap)} length is ${Object.keys(TxsMap).length}`);
    let users = TxsToUserData(TxsMap,ArweaveTagNames.source);

    return users;
}

function txToUser(tx: any,whichUser: string) {
    let ret: UserData = {address:'',addressType:'Eth',alias:''};
    if (whichUser==ArweaveTagNames.source) {
        ret.address = tx[ArweaveTagNames.source];
        ret.addressType = "Eth";
        ret.alias = "";
    }
    else {
        ret.address = tx[ArweaveTagNames.connTarget];
        ret.addressType = tx[ArweaveTagNames.targetType];
        ret.alias = tx[ArweaveTagNames.alias];
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



