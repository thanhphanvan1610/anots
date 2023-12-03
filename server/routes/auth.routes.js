import { Router } from 'express';
import UserAuthService from '../controllers/auth.controllers.js';

const auth = new UserAuthService();
const router = Router();

router.post('/signup', auth.signUp.bind(auth));
router.post('/signin', auth.signIn.bind(auth));
router.post('/refresh', auth.refreshToken.bind(auth));


const authRoutes = router;
export default authRoutes;