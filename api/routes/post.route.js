import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create } from '../controller/post.controller.js';
import { getpost } from '../controller/post.controller.js';
import { deletePost } from '../controller/post.controller.js';
import { updatePost } from '../controller/post.controller.js';
import { likePost } from '../controller/post.controller.js';
import { getComments } from '../controller/post.controller.js';
import { commentPost } from '../controller/post.controller.js';
import { deleteComment } from '../controller/post.controller.js';
import { getAdminStats } from '../controller/post.controller.js';
import { getLike } from '../controller/post.controller.js';
import { newVisitor } from '../controller/visitor.controller.js';
import { getVisitorCount } from '../controller/visitor.controller.js';
import { getPopularPosts } from '../controller/post.controller.js';
import { getRelatedPosts } from '../controller/post.controller.js';
const router = express.Router();

router.post('/create',verifyToken,create)

router.get('/getpost',getpost)

router.get('/popularPost',getPopularPosts)

router.post('/newVisitor',newVisitor)

router.get('/relatedPost/:postId',getRelatedPosts)

router.get('/getVisitorCount',getVisitorCount)
router.delete('/delete/:postId',verifyToken,deletePost)
router.put('/update/:postId',verifyToken,updatePost)

router.put('/comment/:postId',verifyToken,commentPost)

router.get('/getComment/:postId',verifyToken,getComments)

router.put('/like/:postId',verifyToken,likePost)

router.get('/getLike/:postId',verifyToken,getLike)

router.get('/getAdminStats',verifyToken,getAdminStats)

router.delete('/deleteComment/:postId/:createdAt',verifyToken,deleteComment)

export default router;