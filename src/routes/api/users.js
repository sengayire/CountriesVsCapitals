import { Router } from 'express';
import UserController from '../../controllers/UserController';
import verifyToken from '../../middlewares/verifyToken';

const router = Router();

router.get('/', verifyToken, UserController.findOne);
router.get('/:id', verifyToken, UserController.findOne);

export default router;
