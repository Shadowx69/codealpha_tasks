import express from 'express';
const router = express.Router();
import { addCategory, updateCategory, deleteCategory, addProduct, updateProduct, deleteProduct } from '../controllers/admin.js';

 


router.post('/add-category', addCategory);
router.post('/update-category', updateCategory);
router.post('/delete-category', deleteCategory);

router.post('/add-product', addProduct);
router.post('/update-product', updateProduct);
router.post('/delete-product', deleteProduct);
  

export default router;
