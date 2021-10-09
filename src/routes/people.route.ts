import { Router } from 'express'
import { getPeople, savePerson } from '../controllers/people.controller';

const router = Router();

router.route('/people')
    .get(getPeople);

router.route('/register')
    .post(savePerson);

export default router;