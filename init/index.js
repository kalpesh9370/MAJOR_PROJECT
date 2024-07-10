const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err);
})


async function main() {
    await mongoose.connect(MONGO_URL); 
}



//************************************************** */
// "async and await make promises easier to write"

// async makes a function return a Promise

// await makes a function wait for a Promise


//initailizing database
const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();