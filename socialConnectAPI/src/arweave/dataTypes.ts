
export type ConnType = "Follow" | "Unfollow";
export type AddressType = "Eth" | "Arweave";
export type Response = "OK" | "Failed";
export type UserData = {
    address: string,
    addressType: AddressType,
    alias: string
}




//arweave data
export const ArweaveTagNames =
{
    connType:   "ConnectionType",
    alias:      "Alias",
    connTarget: "Target",
    nameSpace:  "NameSpace",
    targetType: "targetType",
    createdDate:"Created At",
    source:     "Source Address"
};



//api data

//follow req
export type followReqData = {
  sourceAddress: string,
  target: string,
  namespace: string,
  alias: string,
  targetType: AddressType,
  sig: string
}



//follow response
export type apiResponse = {status: Response};

//unfollow req
export type unfollowReqData = {
    sourceAddress: string,
    target: string,
    targetType: AddressType,
    namespace: string,
    sig: string
}


//followings req
export type followingsReqData = {
    target: string,
    namespace: string
}
//followings response
export type followingsResData = {
    status: Response,
    data:UserData[]    
}


//followers req
export type followersReqdata = {
    target : string,
    targetType: AddressType,
    namespace: string
}

//followers response
export type followersResData = {
    status : Response,
    data:UserData[]    
}