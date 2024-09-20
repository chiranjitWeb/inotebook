const mongoose = require('mongoose');
const mongoURI ='mongodb://localhost:27017';


// const connectToMongo = () =>{
//     mongoose.connect(mongoURI, ()=>{
//         console.log("Connected to Mongo Successfully");
//     })
   ////correct
    //mongoose.connect(mongoURI).then(()=>console.log("Connected")).catch((e)=>console.log(e.message))
    
// }
///correct 
// const connectToMongo=()=>{
//     mongoose.connect(mongoURI);
//     console.log("connected to mongo");
// }
const connectToMongo = async () => {
    try {
      //mongoose.set("strictQuery", false);
      mongoose.connect(mongoURI);
      console.log("Connected to mongoDB successfully");
    } catch (error) {
      console.log(error);
      process.exit();
    }
  }

module.exports = connectToMongo;