import express from 'express';
import * as arweaveImpl from './../arweave/scArweaveImpl';

const router = express.Router();

router.post('/follow', async (req, res) => {

  let ret: boolean = await arweaveImpl.follow(req.body.data);
  res.json({
    status: ret===false?'Failed':'OK'});
  }
)

router.post('/unfollow', async (req, res) => {

  let ret: boolean = await arweaveImpl.unfollow(req.body.data);
  res.json({
    status: ret===false?'Failed':'OK'});
  }
)

router.post('/followers', (req, res) => {

  let ret = arweaveImpl.followers(req.body.data);
  res.json(typeof ret =="boolean"?{status: 'Failed'}:{...ret,status:'OK'});
  }
)

router.post('/followings', (req, res) => {

  let ret = arweaveImpl.followings(req.body.data);
  res.json(typeof ret =="boolean"?{status: 'Failed'}:{...ret,status:'OK'});
  }
)

module.exports = router;