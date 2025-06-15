import express from 'express';
// import asyncHandler from 'express-async-handler';
import { register, login } from '../controllers/AuthController'; // 🟢 Thêm login

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
export default router;
