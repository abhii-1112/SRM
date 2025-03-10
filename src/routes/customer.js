// routes/customers.js
import { Router } from 'express';
import bodyParser from 'body-parser';
const router = Router();
import { getCustomerbyID, createCustomer, deleteCustomer, getAllCustomers, updateCustomer } from '../controllers/controllercustomer.js';

// Get customer by ID
router.get('/:id', getCustomerbyID);

//Get all Customers
router.get('/', getAllCustomers)

// Create a new customer
router.post('/create', createCustomer);

// Update customer
router.put('/:id/update/', updateCustomer);

// Delete a customer
router.delete('/:id', deleteCustomer);

export default router;
