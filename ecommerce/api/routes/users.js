import express from 'express';
import { getUser, updateAddress } from '../controllers/user.js';

const router = express.Router();

router.get('/:id', getUser);
router.put('/:id/address', updateAddress);

export default router;