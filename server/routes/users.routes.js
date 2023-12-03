import {Router} from 'express';
import * as User from '../controllers/users.controllers.js';

const router = Router();

router.get('/', User.getUsers);
router.put('/:id', User.updateUser)
router.get('/:id', User.getUserById)
router.delete('/:id', User.deleteUser)
router.post('/ban', User.banUser)
router.post('/unban', User.unBanUser)



const userRoutes = router;
export default userRoutes;
