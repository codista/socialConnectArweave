import Arweave from 'arweave';
import dotenv from 'dotenv';
dotenv.config();

async function initArweave(): Promise<false | object> {
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
    return {Wallet: wallet, Address: address, Arweave: arweave};
}
  


export async function follow(data: object): Promise<boolean> {

    


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