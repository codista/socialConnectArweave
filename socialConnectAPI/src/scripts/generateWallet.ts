import Arweave from 'arweave';
import fs from "fs";
import path from "path"

async function main() {
    const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
    });

    //generate arweave key
    const key = await arweave.wallets.generate();
    var envPath = path.join(__dirname, '..', '..',".env");

    //write key and address to .env
    fs.appendFileSync(envPath,'\n'+'ARWEAVE_KEY='+JSON.stringify(key)+'\n');
    const address = await arweave.wallets.jwkToAddress(key);
    fs.appendFileSync(envPath,'ARWEAVE_ADDRESS='+address+'\n');

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});