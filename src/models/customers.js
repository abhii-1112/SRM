// models/Customer.js
import { Schema, model } from 'mongoose';

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  img : {
    type: String,
  },

  dob: {
    type: Date,
    default: Date.now
  },
  isRecognised: {
    type: Boolean,
    default: false // Initially false, updated when the customer is recognized
  },
  inRestaurant: {
    type: Boolean,
    default: false // Indicates if the customer is currently in the restaurant
  },
  lastVisit: {
    type: Date,
    default: null // Tracks the last time the customer visited
  },
  visitCount: { 
    type: Number, 
    default: 0 
  }
});

export default model('Customer', CustomerSchema);
