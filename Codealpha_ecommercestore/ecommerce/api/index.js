import express from 'express';
import cors from 'cors'; // Import CORS
import productRoutes from './routes/products.js';
import productSearchR from './routes/ProductSS.js';
import admRoutes from './routes/adminR.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import orderdetailRoutes from './routes/orderdetails.js';
import paymentRoutes from './routes/payments.js';
import userRoutes from './routes/users.js';
import dotenv from "dotenv";
import { addToCart, getCart, clearCart } from './controllers/cartController.js';
import cartRoutes from './routes/cart.js';

 


const app = express();
dotenv.config();
app.use(cors())
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend's URL
    credentials: true, // Allow cookies if needed
}));
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/productsS', productSearchR);
app.use('/api/adminR', admRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orderdetails', orderdetailRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.post('/api/cart/add', addToCart);
app.get('/api/cart/:userId', getCart);
app.use('/api/cart', cartRoutes);
app.delete('/api/cart/clearCart', clearCart);

app.listen(8800, ()=> {
    console.log("Connected");
}) 