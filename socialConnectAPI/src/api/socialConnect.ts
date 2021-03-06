import express from 'express';
import * as arweaveImpl from './../arweave/scArweaveImpl';
import type {followReqData,followersReqdata,followingsReqData,unfollowReqData} from "./../arweave/dataTypes"
import  { body,validationResult } from 'express-validator';


const router = express.Router();

const validateTargetType = (value) => {
  if (value != "Eth" && value !== "Arweave") {
    throw new Error('targetType should be either "Eth" or "Arweave"');
  }
  // Indicates the success of this synchronous custom validator
  return true;
};

/**
* @api {post} /api/v1/sc/follow 
* @apiName follow address
*
* @apiParam  {String} [sourceAddress] source (following) address (eth)
* @apiParam  {String} [target] target (followed) address (eth or arweave)
* @apiParam  {String} [namespace] app name
* @apiParam  {String} [alias] target address alias (optional)
* @apiParam  {String} [targetType] target address type: "Eth" or "Arweave"
* @apiParam  {String} [sig] source address signature
*
* @apiSuccess (200) {Object} {status: "OK"}
*/
router.post('/follow', 
  body('sourceAddress').isEthereumAddress(),
  body('target').isString(),
  body('namespace').isString(),
  body('alias').optional().isString(),
  body('targetType').custom(validateTargetType),
  body('sig').isString(),
  async (req: express.Request, res: express.Response) => {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('got errors '+JSON.stringify(errors));
      return res.status(400).json({status: 'Failed', errors: errors.array() });
    }
  


    //cast data and call implementation
    let reqdata: followReqData = req.body as followReqData;
    let ret = await arweaveImpl.follow(reqdata);
    if (typeof ret =="boolean" && ret==false){
      console.error('follow failed')
      return res.status(400).json({status: 'Failed' });
    }
    else {
      return res.status(200).json({status: 'OK',tx_id: ret});
    }
  }
)

/**
* @api {post} /api/v1/sc/unfollow Unfollow
* @apiName unfollow address
*
* @apiParam  {String} [sourceAddress] source address (eth)
* @apiParam  {String} [target] target address (eth or arweave)
* @apiParam  {String} [namespace] app name
* @apiParam  {String} [targetType] target address type: "Eth" or "Arweave"
* @apiParam  {String} [sig] source address signature
*
* @apiSuccess (200) {Object} {status: "OK"}
*/
router.post('/unfollow',
  body('sourceAddress').isEthereumAddress(),
  body('target').isString(),
  body('namespace').isString(),
  body('targetType').custom(validateTargetType),
  body('sig').isString(),
  async (req: express.Request, res: express.Response) => {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status: 'Failed', errors: errors.array() });
    }
  
    //cast data and call implementation
    let reqdata: unfollowReqData = req.body as unfollowReqData;
    let ret = await arweaveImpl.unfollow(reqdata);
    if (typeof ret =="boolean" && ret==false){
      return res.status(400).json({status: 'Failed' });
    }
    else {
      return res.status(200).json({status: 'OK',tx_id:ret});
    }
  }
  )


  
/**
* @api {post} /api/v1/sc/followers 
* @apiName Followers
*
* @apiParam  {String} [target] target address (eth or arweave)
* @apiParam  {String} [targetType] target address type: "Eth" or "Arweave"
* @apiParam  {String} [namespace] app name
*
* @apiSuccess (200) {Object} 
*/
router.post('/followers',
  body('target').isString(),
  body('namespace').isString(),
  body('targetType').custom(validateTargetType),
  async (req: express.Request, res: express.Response) => {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status: 'Failed', errors: errors.array() });
    }
  
    //cast data and call implementation
    let reqdata: followersReqdata = req.body as followersReqdata;
    let followers = await arweaveImpl.followers(reqdata);
    if (typeof followers =="boolean" && followers==false){
      return res.status(400).json({status: 'Failed' });
    }
    else {
      let returnJson =  {status: 'OK',users: followers};
      //console.log("followings before return is "+JSON.stringify(returnJson));
      return res.status(200).json(returnJson);
    }
  }
)

/**
* @api {post} /api/v1/sc/followings 
* @apiName followings
*
* @apiParam  {String} [target] target address (eth or arweave)
* @apiParam  {String} [namespace] app name
*
* @apiSuccess (200) {Object} 
*/
router.post('/followings',
  body('target').isString(),
  body('namespace').isString(),
  async (req: express.Request, res: express.Response) => {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status: 'Failed', errors: errors.array() });
    }
  
    //cast data and call implementation
    let reqdata: followingsReqData = req.body as followingsReqData;
    let followings = await arweaveImpl.followings(reqdata);
    if (typeof followings =="boolean" && followings==false){
      return res.status(400).json({status: 'Failed' });
    }
    else {
      let returnJson =  {status: 'OK',users: followings};
      //console.log("followings before return is "+JSON.stringify(returnJson));
      return res.status(200).json(returnJson);
    }
  }
)

module.exports = router;