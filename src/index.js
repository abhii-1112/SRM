import e from 'express';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import path from 'path';


const app = e()

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const __dirname = path.resolve(); // Get the current directory
app.use('/trainss', e.static(path.join(__dirname, 'trainss')));

import customerRoutes from './routes/customer.js';
import menuRoutes from './routes/menu.js';
import userRoutes from './routes/user.js';
import recognisedRoutes from './routes/recognised.js';
import dashboardRoutes from './routes/dashboard.js';

app.use('/api/customers', customerRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recognised',recognisedRoutes);
app.use('/api/dashboard', dashboardRoutes)

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://abhishektripathi1112:3faZYKthb5YaWUun@cluster0.lkfn6ty.mongodb.net/customer?retryWrites=true&w=majority&appName=Cluster0")
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

connectDB()
  .then(() => {
    app.listen( 8000, () => {
      console.log(`⚙️ Server is running at port :8000`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });


// Connect to MongoDB


// Routes


// Start the server


//mongodb+srv://abhishektripathi1112:3faZYKthb5YaWUun@cluster0.lkfn6ty.mongodb.net/customer?retryWrites=true&w=majority&appName=Cluster0

// function co(){
//   console.log("thisisi claling");
//   connect('mongodb+srv://abhishektripathi1112:3faZYKthb5YaWUun@cluster0.lkfn6ty.mongodb.net')
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));
// }
// co()


// Connect to MongoDB
