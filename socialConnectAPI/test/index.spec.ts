import { expect } from 'chai';
import 'mocha';
import  { curly } from "node-libcurl";
import { and, or, equals } from 'arql-ops';
import Arweave from 'arweave';
import {ArweaveTagNames} from './../src/arweave/dataTypes'
import dotenv from 'dotenv';
dotenv.config();



describe('Follow API', 
  () => { 
    let arweave: any;
    let sourceaddr = "0xf8432C8a7F8d4D1ec8a5c1005E6AB67fE4c4bc20";
    let targetaddr = "0x1e6527CB3132E792A067C6e1925692d35D3C1f32"; 
    before(()=>{
        arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https'
        });

    }) ;


    it('should retrieve followers', async () => { 
        let params = {
            target: targetaddr,
            namespace: "SocialConnect",  
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

    it('should succeed to call api follow address', async () => { 
        let params = {
            sourceAddress: sourceaddr,
            target: targetaddr,
            namespace: "SocialConnect",
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
        expect(statusCode).to.equal(200); 
        
        
        const myQuery =and(equals('from', process.env.ARWEAVE_ADDRESS),
            equals(ArweaveTagNames.source,sourceaddr),
            equals(ArweaveTagNames.connTarget,targetaddr),
            equals(ArweaveTagNames.connType,"Follow")
            );  
        const results = await arweave.arql(myQuery);
        //console.log(`results for ${JSON.stringify(myQuery)} ` + JSON.stringify(results));
        expect(results.length).to.not.equal(0); 
  }); 

  it('follow should fail if address not ethereum address', async () => { 
    let params = {
        sourceAddress: "aaaddd",
        target: "0xf0Afc48C0cEc8Dae260C7597Aef0031A3A5CE8E3",
        namespace: "SocialConnect",
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
}); 

});