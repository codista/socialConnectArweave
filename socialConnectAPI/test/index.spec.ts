import { expect } from 'chai';
import 'mocha';
import  { curly } from "node-libcurl";
import { and, or, equals } from 'arql-ops';
import Arweave from 'arweave';
import {ArweaveTagNames} from './../src/arweave/dataTypes'
import dotenv from 'dotenv';
dotenv.config();
import {ethers} from 'ethers'



describe('Follow API', 
  () => { 
    let arweave: any;
    let sourceaddr = "0xf8432C8a7F8d4D1ec8a5c1005E6AB67fE4c4bc20";
    let targetaddr = "0x1e6527CB3132E792A067C6e1925692d35D3C1f32"; 
    let provider = new ethers.providers.AlchemyProvider("homestead", process.env.ALCEHMY_KEY);
    let wallet1 = new ethers.Wallet(process.env.ADDRESS_1 as string,provider);
    let wallet2 = new ethers.Wallet(process.env.ADDRESS_2 as string,provider);
    let wallet3 = new ethers.Wallet(process.env.ADDRESS_3 as string,provider);
    let wallet4 = new ethers.Wallet(process.env.ADDRESS_4 as string,provider);


    const namespace = Math.random().toString();  //make sure each test starts with a clean app with no previous follows/unfollows.
    console.log(`testing starting with namespace ${namespace}`);
    before(()=>{
        arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https'
        });

    }) ;

    it('should succeed to call api follow address', async () => { 
        let address1 = await wallet1.getAddress();
        let address2 = await wallet2.getAddress();
        let sig = await wallet1.signMessage("Follow"+" "+address2+" "+namespace);
        let params = {
            sourceAddress: address1,
            target: address2,
            namespace: namespace,
            alias: "David",
            targetType: "Eth",
            sig: sig
        }
        
        const { statusCode, data } = await curly.post('http://localhost:3000/api/v1/sc/follow', {
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
        let firstTx = data.tx_id;
        
    }); 

    


    /*it('should retrieve followings', async () => { 
        let params = {
            target: sourceaddr,
            namespace: namespace
        }
        const { statusCode, data, headers } = await curly.post('http://localhost:3000/api/v1/sc/followings', {
            postFields: JSON.stringify(params),
            httpHeader: [
                'Content-Type: application/json',
                'Accept: application/json'
            ],
        });
        console.log(`status code: ${statusCode} data: ${JSON.stringify(data)}`) ;
        expect(statusCode).to.equal(200); 
    });

    it('should retrieve followers', async () => { 
        let params = {
            target: targetaddr,
            namespace: namespace,  
            targetType: "Eth",
        }
        const { statusCode, data, headers } = await curly.post('http://localhost:3000/api/v1/sc/followers', {
            postFields: JSON.stringify(params),
            httpHeader: [
                'Content-Type: application/json',
                'Accept: application/json'
            ],
        });
        console.log(`status code: ${statusCode} data: ${JSON.stringify(data)}`) ;
        expect(statusCode).to.equal(200); 
    });

    

    it('follow should fail if address not ethereum address', async () => { 
        let params = {
            sourceAddress: "aaaddd",
            target: "0xf0Afc48C0cEc8Dae260C7597Aef0031A3A5CE8E3",
            namespace: namespace,
            alias: "David",
            targetType: "Eth",
            sig: "test"
        }
        const { statusCode, data, headers } = await curly.post('http://localhost:3000/api/v1/sc/follow', {
            postFields: JSON.stringify(params),
            httpHeader: [
                'Content-Type: application/json',
                'Accept: application/json'
            ],
        });
        console.log(`status code: ${statusCode} data: ${JSON.stringify(data)}`) ;
        expect(statusCode).to.not.equal(200);   
    }); */

});