import customers from '../models/customers.js';
import Customer from '../models/customers.js';

//Function to retrieve recognised customer images
export const getrecognisedImg = async (req, res) => {
  // const {id} = req.params
  // console.log(id)
  try {
      const recognisedImg = await Customer.find({
        isRecognised : true,
        img: { $exists: true,  $ne: "" }
  }).select("name _id img");
      if(recognisedImg.length===0){
        return res.status(404).json({message: "Customer not found"})
      }
      return res.status(200).json({ customers: recognisedImg }); // Send full array
    
  }catch (err){
    return res.status(500).json({message: "Internal Server Error"})
  }
}

export const getUnrecognisedImg = async (req, res) => {
  try {
    const unRecognisedImg = await Customer.find({
      isRecognised : false,
      inRestaurant: true,
      img: {$exists: true, $ne: ""}
    })
    if(unRecognisedImg.length===0){
      return res.status(404).json({message: "Customer not found"})
    }
    return res.status(200).json({message: "Img fetched successfully",
      customers: unRecognisedImg
    });
  } catch (err){
    return res.status(500).json({message: "Internal server error"})
  }
}
// Function to update recognition status
export const updateRecognitionStatus = async (req, res) => {
  try {
    const { customerID } = req.body; // ID sent from app.py upon recognition
    console.log(customerID)
    // Check if customer exists
    const customer = await Customer.findById(customerID);
    console.log(customerID)
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update the fields
    customer.isRecognised = true;
    customer.inRestaurant = true;
    customer.lastVisit = new Date();

    await customer.save(); // Save updates to the database
    console.log(customerID);
    return res.status(200).json({ message: 'Customer status updated', customer })

    
  } catch (error) {
    console.error('Error updating customer status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getrecognisedCustomer = async (req, res) => {

    try {
        const recognisedCustomers = await Customer.find(
            {
                isRecognised : true,
                inRestaurant : true
            }
        );

        // Check if any customers were found
        if (!recognisedCustomers.length) {
            return res.status(404).json({ message: 'No recognized customers found' });
      }

        // Return the list of recognized customers
        return res.status(200).json({ 
         message: 'Recognized customers fetched successfully',
        customers: recognisedCustomers 
      });
    }
    catch (error) {
        console.error('Error fetching recognized customers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};

export const updateUnrecognised = async (req, res) => {
  try {
    const { isRecognised} = req.body;

    // Check if the request is for an unrecognized face
    if (isRecognised === false) {
      // Create a new unrecognized customer or update an existing one (if needed)
      const newCustomer = new Customer({
        name: "Unknown",  // Placeholder name for unrecognized faces
        phone: "N/A",
        isRecognised: false,
        inRestaurant: true,
        lastVisit: new Date(),
        //imageUrl: imageUrl || null // Store the image URL if provided
      });

      await newCustomer.save();
      return res.status(201).json({ message: 'Unrecognized customer saved successfully', customer: newCustomer });
    } else {
      return res.status(400).json({ message: 'Invalid request. Customer is recognized.' });
    }
  } catch (error) {
    console.error('Error updating unrecognized status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUnrecognised = async (req, res) => {
  try {
    const unRecognisedCustomers = await Customer.find({
      isRecognised: false,
      inRestaurant: true  
    });

    if (!unRecognisedCustomers.length) {
      return res.status(404).json({ message: 'No unrecognized customers found' });
    }

    return res.status(200).json({
      message: "Unrecognized customers fetched successfully",
      customers: unRecognisedCustomers
    });

  } catch (error) {
    console.error('Error fetching unrecognized customers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateVisitcount = async (req, res) => {
  
  try{
    const {id} = req.params;
    const customer = await Customer.findById(id);
    if (!customer){
      return res.status(404).json({message: "Customer not found"})
    }

    customer.lastVisit = new Date();
    customer.visitCount +=1;
    await customer.save();
   
    return res.status(200).json({
      message: "Visit count updated successfully",
      visitCount: customer.visitCount,
      lastVisit: customer.lastVisit
    });
  } catch (error) {
    console.error("Error updating visit count", error);
    return res.status(500).json({message: "Internal Server Error"});
  }
};


