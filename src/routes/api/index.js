import express from 'express';
import auth from './auth';

const router = express.Router();

router.get('/', (req, res) => res.status(200).json({
  message: 'Hello, welcome to our gaming platform!'
}));
router.use('/auth', auth);

export default router;
