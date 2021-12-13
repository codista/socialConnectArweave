import Arweave from 'arweave';
import Wallets from 'arweave/node/wallets';
import { and, or, equals } from 'arql-ops';
import dotenv from 'dotenv';
import {followingsReqData,followReqData,AddressType,followersReqdata,unfollowReqData,ArweaveTagNames,ConnType} from "./dataTypes"
import {getFollowers,getFollowings,validateSignedMessage,expandTransactions,getLatest,submitAndWaitForConfirmation} from "./arweaveHelpers"
dotenv.config();

export async function initArweave() {
    let arweave: any,wallet: any,address: any,balance: any;
    try {
        arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https'
        });

        wallet = JSON.parse(process.env.ARWEAVE_KEY);
        address = await arweave.wallets.jwkToAddress(wallet);
        balance = await arweave.wallets.getBalance(address);
        console.log(`Arweave initialized. wallet address: ${address}. address balance: ${balance}`);
    }
    catch(error) {
        console.error("exception in initArweave",error.message);
        return false;
    }
    return {wallet: wallet, address: address, arweave: arweave};
}
  




export async function follow(data: followReqData): Promise<boolean | string> {
    
    let ar =  await initArweave();
    if (typeof ar == "boolean" && ar==false) {return false;}  
    const {wallet, address,arweave} = ar;

    //validate request signature
    let ct: ConnType="Follow";
    let message: string = ct+" "+data.target+" "+data.namespace;
    let validSig = validateSignedMessage(data.sig,message,data.sourceAddress);
    if (!validSig) {
        console.error("invalid signature at follow");
        return false;
    }
    else {
        console.log("signature validated");
    }

    let alreadyFollowing = await isFollowing(data.sourceAddress, data.target,data.namespace,arweave);
    if (typeof alreadyFollowing=="string") {
        console.log('already following, returning existing transaction id '+alreadyFollowing);
        return alreadyFollowing;         //success with last follow tx id since we don't need to re-follow
    } else {
        console.log('not aleady following, needs to submit new transaction. '+alreadyFollowing);
    }

    //create and send transaction
    let transaction: any;
    try {
        transaction = await arweave.createTransaction({ data: " " },wallet);
        let ct: ConnType  = "Follow";
        transaction.addTag(ArweaveTagNames.connType, ct);
        transaction.addTag(ArweaveTagNames.connTarget, data.target);
        transaction.addTag(ArweaveTagNames.nameSpace, data.namespace);
        transaction.addTag(ArweaveTagNames.targetType, data.targetType);
        transaction.addTag(ArweaveTagNames.alias, data.alias);
        transaction.addTag(ArweaveTagNames.createdDate, Date.now());
        transaction.addTag(ArweaveTagNames.source, data.sourceAddress);
        await arweave.transactions.sign(transaction, wallet);
        let ret = await submitAndWaitForConfirmation(transaction,arweave,false);
        if (!ret) {return false;}
    } catch(err) {
        console.error("exception in follow: ", err.message);
        return false;
    }
    return transaction.id;
}

//return a string with the latest follow transaction id if following, false if not following
export async function isFollowing(source: string, target: string, namespace: string,ar: any) {
    const myQuery =and(equals('from', process.env.ARWEAVE_ADDRESS),
            equals(ArweaveTagNames.source,source),
            equals(ArweaveTagNames.connTarget,target),
            equals(ArweaveTagNames.nameSpace,namespace),
    );
    const results = await ar.arql(myQuery);
    if (results.length==0) {
        //console.log('no existing social action between this source and target based on query '+JSON.stringify(myQuery));
        return false;
    }
    let expandedTxs = await expandTransactions(results, ar);
    if (expandedTxs.length==0) {
        return false
    }
    let latest = getLatest(expandedTxs);
    let ctfollow: ConnType = "Follow";
    //console.log(`latest activity between source and target was ${latest[ArweaveTagNames.connType]}`);
    return (latest[ArweaveTagNames.connType]==ctfollow)?latest.id:false;
}

export async function unfollow(data: unfollowReqData): Promise<boolean|string> {
    let ar =  await initArweave();
    if (typeof ar == "boolean" && ar==false) {return false;}  
    const {wallet, address,arweave} = ar;

    //validate request signature
    let ct: ConnType="Unfollow";
    let message: string = ct+" "+data.target+" "+data.namespace;
    let validSig = validateSignedMessage(data.sig,message,data.sourceAddress);
    if (!validSig) {
        console.error("invalid signature at Unfollow");
        return false;
    }

    //only unfollow if currently following
    let isfollowing = await isFollowing(data.sourceAddress, data.target,data.namespace,arweave);
    if (typeof isfollowing=="boolean" && isfollowing===false) {
        return "not following";         //success with dummy tx id since we don't need to unfollow if not following
    }

    //create and send transaction
    let transaction: any;
    try {
        transaction = await arweave.createTransaction({ data: " " },wallet);
        let ct: ConnType  = "Unfollow";
        transaction.addTag(ArweaveTagNames.connType, ct);
        transaction.addTag(ArweaveTagNames.connTarget, data.target);
        transaction.addTag(ArweaveTagNames.nameSpace, data.namespace);
        transaction.addTag(ArweaveTagNames.targetType, data.targetType);
        transaction.addTag(ArweaveTagNames.createdDate, Date.now());
        transaction.addTag(ArweaveTagNames.source, data.sourceAddress);
        await arweave.transactions.sign(transaction, wallet);

        let ret = await submitAndWaitForConfirmation(transaction,arweave,false);
        if (!ret) {return false;}
    } catch(err) {
        console.error("exception in follow: ", err.message);
        return false;
    }

    return transaction.id;
}

export async function followers(data: followersReqdata): Promise<object | boolean> {
    let ar =  await initArweave();
    if (typeof ar == "boolean" && ar==false) {return false;}  
    const {wallet, address,arweave} = ar;

    
    let followers= await getFollowers(data.target,data.targetType, data.namespace,arweave);
    console.log("followers is "+JSON.stringify(followers));
    return followers;
} 

export async function followings(data: followingsReqData): Promise<object | boolean> {
    let ar =  await initArweave();
    if (typeof ar == "boolean" && ar==false) {return false;}  
    const {wallet, address,arweave} = ar;

    
    let followings= await getFollowings(data.target, data.namespace,arweave);
    //console.log("followings is "+JSON.stringify(followings));
    return followings;
} 