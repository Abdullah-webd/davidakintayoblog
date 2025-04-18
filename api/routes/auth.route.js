import express from 'express';
import { signup } from '../controller/auth.ccontroller.js';
import { signin } from '../controller/auth.ccontroller.js';
import { google } from '../controller/auth.ccontroller.js';
const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/signin',signin);
authRouter.post('/google',google);

export default authRouter;