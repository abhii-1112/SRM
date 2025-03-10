// models/Customer.js
import { Schema, model } from 'mongoose';
//import bcrypt from "bcrypt";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetOTP: {
    type: String
  },
  expireOTP: {
    type: Date
  }
}
);

// UserSchema.pre('save', async function (next) {
//   const user = this;

//   if (!user.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     next();
//   } catch (error) {
//     if (error) return console.error(error.message)
//   }
// });

// UserSchema.methods.comparePassword = async function (pass)  {
//   return await bcrypt.compare(pass, this.password)
// }


export default model('Users', UserSchema);
