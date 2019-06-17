import express from 'express';
import facebook from './facebook';
import twitter from './twitter';
import google from './google';

const router = express.Router();

router.use('/facebook', facebook);
router.use('/twitter', twitter);
router.use('/google', google);

export default router;
