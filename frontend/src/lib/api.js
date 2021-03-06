import {API_URL_BASE} from "./conf_private"
import ethers from "ethers"

export const APP_NAMESPACE = "SocialConnect";

export async function signMessage(provider,message) {
    let signer = provider.getSigner();
    if (!signer) {console.error("attempt to sign with no sigher");return false;}
    let address = await signer.getAddress();
    let signature = await signer.signMessage(message);
    return signature;
}


export async function makeAPICall(apiFunction, params) {
    let retJson={};
    try {
        let url=  API_URL_BASE+apiFunction;
        console.log("fetching url: "+url);
        let res = await fetch(url,{
            method: 'POST',
            mode: 'cors', 
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(params) // body data type must match "Content-Type" header
          });
        if (res.status=="200")
        {
            retJson = await res.json();
            console.log("client received api results: "+JSON.stringify(retJson));
        }  
        else {
            console.error(`fetching api results returned error ${JSON.stringify(res)}`);
        }
    }
    catch(err){
        console.error(`fetching api results returned error ${err} `);
    }
    return retJson;
}