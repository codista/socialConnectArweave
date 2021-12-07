import Arweave from 'arweave';
import Wallets from 'arweave/node/wallets';
import dotenv from 'dotenv';
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
        balance = arweave.wallets.getBalance(address);
        console.log(`Arweave initialized. wallet address: ${address}. address balance: ${balance}`);
    }
    catch(error) {
        console.error("exception in initArweave",error.message);
        return false;
    }
    return {wallet: wallet, address: address, arweave: arweave};
}
  


export async function follow(data: object): Promise<boolean> {
    
    let ar =  await initArweave();
    if (typeof ar == "boolean") {return false;}  
    const {wallet, address,arweave} = ar;
    const transaction = await ar.arweave.createTransaction({ data: "test" },wallet);
    transaction.addTag("test-tag-1", "test-value-1");
    await arweave.transactions.sign(transaction, wallet);


    return true;
} 

export async function unfollow(data: object): Promise<boolean> {
    return true;
}

export async function followers(data: object): Promise<object | boolean> {
    return true;
} 

export async function followings(data: object): Promise<object | boolean> {
    return true;
} 