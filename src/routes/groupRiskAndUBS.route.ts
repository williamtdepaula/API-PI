import { Router } from 'express'
import { getGroupRiskAndUBS, getUBSs } from '../controllers/groupRiskAndUBS.controller';

const router = Router();

router.route('/groupRiskAndUBS')
    .get(getGroupRiskAndUBS);

router.route('/getUBSs')
    .get(getUBSs)

export default router;