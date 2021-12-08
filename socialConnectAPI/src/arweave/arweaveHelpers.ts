

//fetch detailed tx information from a list of transaction ids as json
export async function expandTransactions(tx_ids: string[], ar: any): Promise<any> {
    let res = new Array();
    let tx: any;
    for(var i=0;i<tx_ids.length;i++) {
        try {
            tx = await ar.transactions.get(tx_ids[i]);
            let txJson = tx.toJSON();
            let tags = tx.get('tags');
            for(var j=0;j<tags.length;j++) {
                let key = tags[j].get('name', {decode: true, string: true});
                let value = tags[j].get('value', {decode: true, string: true});
                txJson[key] =value;
                console.log(`got pair ${key} and ${value}`); 
            }
            console.log("got transaction tx "+JSON.stringify(txJson));    
            res.push(txJson);
        }
        catch(err) {console.error("failed at expand tx "+tx_ids[i]+err,err)}    
    }

    return res;
}

//returns the last transaction based on the createdBy tag
export async function getLatest(txs: any) {

}

export async function extractUserData() {

}