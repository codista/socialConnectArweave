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

The lists of current followings/followers are retrieved using arql queries. The API sorts by date all follow/unfollow transactions of a user for a particular target address, and if the latest transaction is Follow, the user is considered to be following the target address. if the last transaction is Unfollow (or no transactions exist) the user is considered to not follow the target address

## addresses and validation
At this stage the app supports the following address to be an ethereum address and the followed address to be either an ethereum or an arweave address. Validation of actions is done using a signature using the private key of the address doing the following/unfollowing. The signature message includes the action and the target address, and is stored onchain in arweave with the transaction so that it can be validated by any using app.

## Pholisiphy behind the architecture
A key design principle behind our architecture is enabling users to use this app without having to install an arweave wallet or own any AR. Burdening the end users with these prerequisites would have been prohibitive to user adoption and is conceptually wrong since arweave should be thought of as underlying infrastructure in this case, transparent to the end user. This is inline with other apps relying on arweave such as mirror.xyz. 

For this reason the service relies on a publicly hosted api server that handles the arweave interactions in the backend. The raw connection data however, is stored solely on arweave and can be used at any point by any third party application or alternative UIs.


## Installation and Usage Instructions

Start by cloning the code to your server

### Api server
- cd to SocialConnectAPI
- Run npm install
- Change .env.sample to .env
- the server can run with either the arweave production or with a local testweave instance (this is defined in the .env file as MODE demo or production). If you're using demo mode, running testweave is needed (see next item), for production mode a funded arweave address is needed.
- clone and run testweave-docker according to the instruction here: https://github.com/ArweaveTeam/testweave-docker.git (note that testweave-docker occupies ports 80 and 3000 so these will need to be available on the server that runs the api)
- In the .env file, fill in the details of your arweave address (with sufficient AR to submit transaction on behalf of the app users) if running in production
- In the .env file, fill in ALCHEMY user key
- In the .env file, fill 4 eth private keys for testing purposes (make sure to set secure permissions to the .env file)
- note that on the .env file the api server is set to use port 3001, this is because testweave ocupies port 3000
- Run npm start to start the api server (npm run dev for dev mode)
- (For production deployment you need to expose the API on a public URL, for testing purposes the API can live on the same machine where the frontend is run and be accessed through localhost:3000)
- For testing: npm run test (requires a local testweave-docker instance running)


### Frontend
- cd to frontend
- Run npm install
- rename src/lib/conf_private.js.sample to conf_private.js
- In conf_private.js, change the API_URL_BASE to the host you're running the api server from (leave as is if on the same machine the frontend runs on)
- Run npm build
- Run npx serve -n -s build -l 80 to serve the app from port 80 (make sure to clear permissions to use port 80 and make sure it is not already used).

## API reference
```
@api {post} /api/v1/sc/follow 
* @apiName follow address
*
* @apiParam  {String} [sourceAddress] source (following) address (eth)
* @apiParam  {String} [target] target (followed) address (eth or arweave)
* @apiParam  {String} [namespace] app name
* @apiParam  {String} [alias] target address alias (optional)
* @apiParam  {String} [targetType] target address type: "Eth" or "Arweave"
* @apiParam  {String} [sig] source address signature
```

```
@api {post} /api/v1/sc/unfollow Unfollow
* @apiName unfollow address
*
* @apiParam  {String} [sourceAddress] source address (eth)
* @apiParam  {String} [target] target address (eth or arweave)
* @apiParam  {String} [namespace] app name
* @apiParam  {String} [targetType] target address type: "Eth" or "Arweave"
* @apiParam  {String} [sig] source address signature
```

```
* @api {post} /api/v1/sc/followers 
* @apiName Followers
*
* @apiParam  {String} [target] target address (eth or arweave)
* @apiParam  {String} [targetType] target address type: "Eth" or "Arweave"
* @apiParam  {String} [namespace] app name
```

```
* @api {post} /api/v1/sc/followings 
* @apiName followings
*
* @apiParam  {String} [target] target address (eth or arweave)
* @apiParam  {String} [namespace] app name
```


