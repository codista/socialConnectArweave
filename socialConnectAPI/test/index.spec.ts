import { expect } from 'chai';
import 'mocha';
import  { curly } from "node-libcurl";
import { and, or, equals } from 'arql-ops';
import Arweave from 'arweave';
import {ArweaveTagNames} from './../src/arweave/dataTypes'
import dotenv from 'dotenv';
dotenv.config();
import {ethers} from 'ethers'
import {waitForConfirmation} from './../src/arweave/arweaveHelpers'
import TestWeave from 'testweave-sdk';



describe('Follow API', 
  () => { 
    let arweave: any,testweave:any;
    let provider = new ethers.providers.AlchemyProvider("homestead", process.env.ALCEHMY_KEY);
    let wallet1 = new ethers.Wallet(process.env.ADDRESS_1 as string,provider);
    let wallet2 = new ethers.Wallet(process.env.ADDRESS_2 as string,provider);
    let wallet3 = new ethers.Wallet(process.env.ADDRESS_3 as string,provider);
    let wallet4 = new ethers.Wallet(process.env.ADDRESS_4 as string,provider);
    let address1: string;
    let address2: string;
    let address3: string;
    let address4: string;

    const namespace = Math.random().toString();  //make sure each test starts with a clean app with no previous follows/unfollows.
    console.log(`testing starting with namespace ${namespace}`);
    before(async ()=>{
        arweave = Arweave.init({
            host: 'localhost',
            port: 1984,
            protocol: 'http',
            timeout: 20000,
            logging: false,
          }); 
          
          testweave = await TestWeave.init(arweave);

        address1 = await wallet1.getAddress();
        address2 = await wallet2.getAddress();
        address3 = await wallet3.getAddress();
        address4 = await wallet4.getAddress();

    }) ;

    it('should succeed to call api follow address', async () => { 
        
        let sig = await wallet1.signMessage("Follow"+" "+address2+" "+namespace);
        let params = {
            sourceAddress: address1,
            target: address2,
            namespace: namespace,
            alias: "David",
            targetType: "Eth",
            sig: sig
        }
        
        const { statusCode, data } = await curly.post('http://localhost:3001/api/v1/sc/follow', {
            postFields: JSON.stringify(params),
            httpHeader: [
                'Content-Type: application/json',
                'Accept: application/json'
            ],
        });
        console.log(`follow status code: ${statusCode} data: ${JSON.stringify(data)}`) ;
        expect(statusCode).to.equal(200); 
        expect(data).to.be.an('object').that.has.property('tx_id');
        expect(data.tx_id).to.not.be.empty;

        let confirmed = await waitForConfirmation(data.tx_id,arweave);
        expect(confirmed).to.equal(true);
    }); 

    


    it('should retrieve followings', async () => { 
        let params = {
            target: address1,
            namespace: namespace
        }
        const { statusCode, data, headers } = await curly.post('http://localhost:3001/api/v1/sc/followings', {
            postFields: JSON.stringify(params),
            httpHeader: [
                'Content-Type: application/json',
                'Accept: application/json'
            ],
        });
        console.log(`status code: ${statusCode} data: ${JSON.stringify(data)}`) ;
        expect(statusCode).to.equal(200);
        expect(data).to.be.an('object').that.has.property('users');
        expect(data.users).to.not.be.empty;
        expect(data.users.length).equal(1);
        expect(data.users[0].address).to.equal(address2);
    });

    it('should retrieve followers', async () => { 
        let params = {
            target: address2,
            namespace: namespace,  
            targetType: "Eth",
        }
        const { statusCode, data, headers } = await curly.post('http://localhost:3001/api/v1/sc/followers', {
            postFields: JSON.stringify(params),
            httpHeader: [
                'Content-Type: application/json',
                'Accept: application/json'
            ],
        });
        console.log(`status code: ${statusCode} data: ${JSON.stringify(data)}`) ;
        expect(statusCode).to.equal(200);
        expect(data).to.be.an('object').that.has.property('users');
        expect(data.users).to.not.be.empty;
        expect(data.users.length).equal(1);
        expect(data.users[0].address).to.equal(address1);
    });

});