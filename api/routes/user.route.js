import express from 'express';
import { test } from '../controller/user.controller.js';
import { updateUser } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controller/user.controller.js';
import { signOut } from '../controller/user.controller.js';
const router = express.Router();
import { getUsers } from '../controller/user.controller.js';
import { deleteUserByAdmin } from '../controller/user.controller.js';

router.get('/users',verifyToken, getUsers);
router.put('/update/:userId',verifyToken, updateUser);
router.delete('/delete/:userId',verifyToken, deleteUser);
router.delete('/deletebyAbdmin/:userId',verifyToken, deleteUserByAdmin);
router.post('/signout', signOut);



export default router;