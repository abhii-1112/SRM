import { Router } from 'express';
import {updateRecognitionStatus, getrecognisedCustomer, updateUnrecognised, getUnrecognised, getrecognisedImg, updateVisitcount} from '../controllers/controllerRecognised.js';
const router = Router();

// Route to update recognition status
router.put('/update-status', updateRecognitionStatus);
router.post('/update-unrecognised-status', updateUnrecognised);
router.get('/get-recognised-customers', getrecognisedCustomer);
router.get('/get-unrecognised-customers', getUnrecognised); 
router.get('/get-recognised-img', getrecognisedImg )
router.put('/update-visit/:id', updateVisitcount)
export default router;
