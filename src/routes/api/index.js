import express from 'express';
import auth from './auth';
import users from './users';

const router = express.Router();

router.get('/', (req, res) => res.status(200).json({
  message: 'Hello, welcome to our gaming platform!'
}));
router.use('/auth', auth);
router.use('/users', users);

export default router;
