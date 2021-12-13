# socialConnectArweave

## solution brief

The solution is based on using arweave tags to keep information on social connections. The format for a social connection transaction is based on the following tags:
```
{
    "ConnectionType":   "Follow" | "Unfollow",
    "Alias":             optional string,
    "Target":           Ethereum address or arweave address,
    "NameSpace":        string representing the app,
    "targetType":       "Eth" | "Arweave",
    "Created At":        "Created At",
    "Source Address":    "Source Address"
}
```
The current connection between source address and target address is based on the last connection transaction  (either "Follow" or "Unfollow")

The solution is based on two components:
- API server (express/nodejs)
- Frontend (React)

A user of the frontend app does not need an aweave wallet. They only need to connect with metamask to sign messages (prooving they are the owners of the ethereum addresses doing the following/unfollowing). The frontend connects to the api server that submits the transactions to the arweave network (after validating the signature). The arweave address on the API server that submits the transactions needs to be loaded with funds to support the transactions.

## Challanges
The main challanges for a production ready app are the spead and confirmaion times of the arweave network. For the purpose of this project we used the arweave SDK/API endpoint. It is possible that when using a local node, speed and performance can be improved.

## Running the app

Start by cloning the code to your server

### Api server
- cd to SocialConnectAPI
- run npm install
- change .env.sample to .env
- fill in the details of your arweave address (with sufficient AR to submit transaction on behalf of the app users), ALCHEMY user key and 4 eth private keys for testing purposes (make sure to set secure permissions to the file)
- Run npm start to start the server (npm run dev for dev mode)
- (For production deployment you need to expose the API on a public URL, for testing purposes the API can live on the same machine where the frontend is run and be accessed through localhost:3000)
- for testing: npm run test


### Frontend
- cd to frontend
- run npm install
- rename src/lib/conf_private.js.sample to conf_private.js
- change the API_URL_BASE to the host you're running the api server from (leave as is if on the same machine the frontend runs on)