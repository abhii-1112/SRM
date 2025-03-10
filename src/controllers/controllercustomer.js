// controllers/customerController.js
import Customer from "../models/customers.js";


// Get customer by id
export async function getCustomerbyID(req, res) {
  const {id}=req.params
  console.log(id);
  try {
    const customer = await Customer.findById(id);
    if(!customer){
      return res.status(400).json({
        message:"Customer not found"
      })
    }
    return res.json(customer);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Create a new customer
export async function createCustomer(req, res) {
  console.log(req.body);


  try {
    const customer = await Customer.create({
      name: req.body.name,
      phone: req.body.phone
    });
    return res.status(201).json(customer);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  res.json(req.body)
}

export async function updateCustomer(req, res) {

    const {id:customerID} = req.params;
    const {img} = req.body
    console.log(customerID);
  try {
    const customer = await Customer.findById(customerID);
    if (!customer){
      return res.status(404).json({message: "Customer not found"});
    }
    if (!img){
      return res.status(404).json({message: "Image Url is empty"});
    }
    customer.img = img;
    await customer.save();
    return res.status(200).json({message: "Image Url added successfully"});
  
  }catch(error){
    console.error('Error updating customer status:', error);
    res.status(500).json({message: "Internal server error"});
  }
  
};

//delte a customer
export async function deleteCustomer(req, res) {
  //console.log(id);

  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      return res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting Customer', error });
    }

    }

    //Get all customers
export async function getAllCustomers(req, res) {

  try {
    const customer = await Customer.find();
    console.log("asdsdff")
    return res.status(200).json({ data: customer });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving Customers data', error });
  }

  
}


