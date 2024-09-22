// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/listing");
// const Booking = require("../models/Booking");  // Make sure you have a Booking model
// const { isLoggedIn } = require("../middleware");

// // Route to show booking form
// router.get("/listings/:id/book", async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }
//     res.render("book", { listing });
// });

// // POST route to handle booking form submission
// router.post("/listings/:id/book", isLoggedIn, async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     const { checkIn, checkOut } = req.body;

//     // Assuming you have a Booking model
//     const booking = new Booking({
//         listing: listing._id,
//         user: req.user._id,
//         checkIn,
//         checkOut,
//     });

//     await booking.save();

//     req.flash("success", "Booking confirmed!");
//     res.redirect(`/listings/${id}`);
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const booking = require("../models/Booking"); // If your file is named 'Booking.js'
const { isLoggedIn } = require("../middleware");

// Route to show booking form
router.get("/listings/:id/book", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("book", { listing });
});

// POST route to handle booking form submission
router.post("/listings/:id/book", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const { checkIn, checkOut } = req.body;

    // Calculate the total number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const numberOfNights = Math.round((checkOutDate - checkInDate) / oneDay);

    // Calculate the total price
    const totalPrice = numberOfNights * listing.price;

    // Save the booking details to the database
    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkInDate,
        checkOutDate,
        totalPrice,
    });

    await booking.save();

    req.flash("success", "Booking confirmed!");

    // Redirect to the bill page
    res.redirect(`/listings/${id}/bookings/${booking._id}/bill`);
});

// Route to show the bill after booking
router.get("/listings/:id/bookings/:bookingId/bill", isLoggedIn, async (req, res) => {
    const { id, bookingId } = req.params;
    const listing = await Listing.findById(id);
    const booking = await Booking.findById(bookingId).populate("user");

    if (!booking || !listing) {
        req.flash("error", "Booking or listing not found!");
        return res.redirect("/listings");
    }

    res.render("bill", { booking, listing });
});

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Route to download the bill as PDF
router.get("/listings/:id/bookings/:bookingId/bill/download", isLoggedIn, async (req, res) => {
    const { id, bookingId } = req.params;
    const listing = await Listing.findById(id);
    const booking = await Booking.findById(bookingId).populate("user");

    if (!booking || !listing) {
        req.flash("error", "Booking or listing not found!");
        return res.redirect("/listings");
    }

    // Create a document
    const doc = new PDFDocument();
    let fileName = `Booking_Bill_${bookingId}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-type', 'application/pdf');

    // Write to the PDF
    doc.pipe(res);
    
    doc.fontSize(20).text(`Booking Bill for ${listing.title}`, { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Thank you for your booking, ${booking.user.username}!`);
    doc.moveDown();
    doc.text(`Check-In Date: ${booking.checkInDate.toDateString()}`);
    doc.text(`Check-Out Date: ${booking.checkOutDate.toDateString()}`);
    
    const numberOfNights = Math.round((booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24));
    doc.text(`Number of Nights: ${numberOfNights}`);
    doc.text(`Total Price: ₹${booking.totalPrice}`);
    
    doc.end();
});


module.exports = router;
