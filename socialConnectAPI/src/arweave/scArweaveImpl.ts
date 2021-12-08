import Arweave from 'arweave';
import Wallets from 'arweave/node/wallets';
import { and, or, equals } from 'arql-ops';
import dotenv from 'dotenv';
import {followReqData,AddressType,followersReqdata,unfollowReqData,ArweaveTagNames,ConnType} from "./dataTypes"
import {expandTransactions} from "./arweaveHelpers"
dotenv.config();

async function initArweave() {
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
    //TO ADD

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

        const resp = await arweave.transactions.post(transaction);
        console.log(`follow tx status is ${resp.status} ${resp.statusText} transaction id is ${transaction.id}`);
    } catch(err) {
        console.error("exception in follow: ", err.message);return false;
    }


    return transaction.id;
} 

export async function unfollow(data: unfollowReqData): Promise<boolean|string> {
    let ar =  await initArweave();
    if (typeof ar == "boolean" && ar==false) {return false;}  
    const {wallet, address,arweave} = ar;

    //validate request signature
    //TO ADD

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

        const resp = await arweave.transactions.post(transaction);
        console.log(`follow tx status is ${resp.status} ${resp.statusText} transaction id is ${transaction.id}`);
    } catch(err) {
        console.error("exception in follow: ", err.message);return false;
    }

    return transaction.id;
}

export async function followers(data: followersReqdata): Promise<object | boolean> {
    let ar =  await initArweave();
    if (typeof ar == "boolean" && ar==false) {return false;}  
    const {wallet, address,arweave} = ar;

    //get all follow transactions whos target is this address.
    const myQuery =and(equals('from', process.env.ARWEAVE_ADDRESS),
            equals(ArweaveTagNames.connTarget,data.target),
            equals(ArweaveTagNames.targetType,data.targetType),
            equals(ArweaveTagNames.nameSpace,data.namespace),
            );  
    const results = await arweave.arql(myQuery);
    let expanded= await expandTransactions(results,arweave);
    console.log("expanded is "+JSON.stringify(expanded));
    return expanded;
} 

export async function followings(data: object): Promise<object | boolean> {
    return true;
} 