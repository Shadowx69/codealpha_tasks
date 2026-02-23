import express from 'express';
import { buyProduct } from '../controllers/order.js';

const router = express.Router();

router.post('/buy', buyProduct);

export default router;