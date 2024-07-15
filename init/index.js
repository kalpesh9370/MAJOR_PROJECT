const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config();
//   }
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err);
})

// const uri = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(MONGO_URL); 
}



//************************************************** */
// "async and await make promises easier to write"

// async makes a function return a Promise

// await makes a function wait for a Promise


//initailizing database
const initDB = async () => {
    // Clear the existing data in the Listing collection
    await Listing.deleteMany({});

    // Add the owner field to each object in the data array
    const updatedData = initData.data.map(obj => ({
        ...obj,
        owner: "66921f2560929b9f2dbb2108"
    }));

    // Insert the updated data into the Listing collection
    await Listing.insertMany(updatedData);

    console.log("Data was initialized");
}

initDB();

//username => Rahul
//email => Rahul@gmail.cpm
//password=> Rahul123