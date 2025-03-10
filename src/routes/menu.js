// routes/customers.js
import { Router } from 'express';
import bodyParser from 'body-parser';

const router = Router();

import {menuController} from '../controllers/controllermenu.js';


router.post('/menu', menuController.createMenuItem);
router.get('/menu', menuController.getAllMenuItems);
router.get('/menu/:id', menuController.getMenuItemById);
router.put('/menu/:id', menuController.updateMenuItem);
router.delete('/menu/:id', menuController.deleteMenuItem);

export default router;
