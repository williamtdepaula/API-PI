import { Router } from 'express'
import { getGroupRiskAndUBS, getUBSByPerson, getUBSs } from '../controllers/groupRiskAndUBS.controller';

const router = Router();

router.route('/groupRiskAndUBS')
    .get(getGroupRiskAndUBS);

router.route('/getUBSs')
    .get(getUBSs)

router.route('/getUBSByPerson')
    .get(getUBSByPerson)

export default router;