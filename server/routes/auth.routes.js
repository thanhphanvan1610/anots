import { Router } from 'express';
import UserAuthService from '../controllers/auth.controllers.js';
import { verifyAccessToken } from '../middlewares/verify_token.js';

const auth = new UserAuthService();
const router = Router();

router.post('/signup', auth.signUp.bind(auth));
router.post('/signin', auth.signIn.bind(auth));
router.post('/refresh', verifyAccessToken,auth.refreshToken.bind(auth));


const authRoutes = router;
export default authRoutes;