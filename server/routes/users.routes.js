import {Router} from 'express';
import * as User from '../controllers/users.controllers.js';

const router = Router();

router.get('/', User.getUsers);
router.put('/:id', User.updateUser)


const userRoutes = router;
export default userRoutes;
