import express from 'express';


const router = express.Router();

import { getAllProductsS } from '../controllers/ProductsS.js';

// Get all products
router.get('/', getAllProductsS);

export default router;