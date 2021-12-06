import express from 'express';
const socialConnect = require('./socialConnect')

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API'
  });
});

router.use('/sc', socialConnect);

export default router;
