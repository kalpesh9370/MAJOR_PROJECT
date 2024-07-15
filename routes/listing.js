const express = require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
// const {listingSchema} = require("./utils/schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const app = express();
const {isLoggedIn,isOwner} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});


// ../MAJOR PROJECT/models/listing.js


router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
  upload.single("listing[image]"),
   wrapAsync(listingController.createListing))

  
//Index Route
// router.get("/", wrapAsync(listingController.index));
  
  //New Route
  router.get("/new",isLoggedIn, listingController.renderNewForm);
  

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,
    upload.single("listing[image]"),
     wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))

  //Show Route
  // router.get("/:id", wrapAsync(listingController.showListing));
  
  //Create Route
  // router.post("/", isLoggedIn, wrapAsync(listingController.createListing));
  
  //Edit Route
  router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editListing));
  
  //Update Route
  // router.put("/:id", isLoggedIn,isOwner, wrapAsync(listingController.updateListing));
  
  //Delete Route
  // router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));
  


  module.exports = router;