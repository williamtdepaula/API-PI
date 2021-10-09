import { Router } from 'express'
import { getGroupRiskAndUBS } from '../controllers/groupRiskAndUBS.controller';

const router = Router();

router.route('/groupRiskAndUBS')
    .get(getGroupRiskAndUBS);

export default router;