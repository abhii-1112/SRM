// routes/user.js
import { Router } from 'express';
import {getAllUsers, createUser, getUserbyID, loginUser, forgotPass, verifyOtp} from "../controllers/controllerUsers.js";

const router = Router();

//get all users details
router.get('/:id', getUserbyID)
router.get('/', getAllUsers);
router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/forget', forgotPass)
router.put('/verify-otp', verifyOtp)


export default router;
