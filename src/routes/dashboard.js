import {Router} from 'express';
import { getVisitcount } from "../controllers/controllerDashboard.js";

const router = Router();

router.get('/visit-count', getVisitcount)

export default router