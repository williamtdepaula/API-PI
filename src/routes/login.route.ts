import { Router } from 'express'
import { login } from '../controllers/login.controller';

const router = Router();

router.route('/login')
    .get(login)

export default router;