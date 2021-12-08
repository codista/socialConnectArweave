import express from 'express';
import * as arweaveImpl from './../arweave/scArweaveImpl';
import type {followReqData,followersReqdata,AddressType,unfollowReqData} from "./../arweave/dataTypes"
import  { body,validationResult } from 'express-validator';


const router = express.Router();

/**
* @api {post} /api/v1/sc/follow Follow
* @apiName follow address
*
* @apiParam  {String} [sourceAddress] source address (eth)
* @apiParam  {String} [target] target address (eth or arweave)
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
  body('alias').isString(),
  body('targetType').custom((value) => {
    if (value != "Eth" && value !== "Arweave") {
      throw new Error('targetType should be either "Eth" or "Arweave"');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
  body('sig').isString(),
  async (req: express.Request, res: express.Response) => {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status: 'Failed', errors: errors.array() });
    }
  


    //cast data and call implementation
    let reqdata: followReqData = req.body as followReqData;
    let ret = await arweaveImpl.follow(reqdata);
    if (typeof ret =="boolean" && ret==false){
      return res.status(400).json({status: 'Failed' });
    }
    else {
      return res.status(200).json({status: 'OK',tx_id:ret});
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
  body('targetType').custom((value) => {
    if (value != "Eth" && value !== "Arweave") {
      throw new Error('targetType should be either "Eth" or "Arweave"');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
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
  body('targetType').custom((value) => {
    if (value != "Eth" && value !== "Arweave") {
      throw new Error('targetType should be either "Eth" or "Arweave"');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
  async (req: express.Request, res: express.Response) => {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status: 'Failed', errors: errors.array() });
    }
  
    //cast data and call implementation
    let reqdata: followersReqdata = req.body as followersReqdata;
    let ret = arweaveImpl.followers(reqdata);
    if (typeof ret =="boolean" && ret==false){
      return res.status(400).json({status: 'Failed' });
    }
    else {
      return res.status(200).json({status: 'OK',...ret});
    }
  }
)

router.post('/followings', (req, res) => {

  let ret = arweaveImpl.followings(req.body.data);
  res.json(typeof ret =="boolean"?{status: 'Failed'}:{...ret,status:'OK'});
  }
)

module.exports = router;