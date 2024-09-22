// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const bookingSchema = new Schema({
//     listing: {
//         type: Schema.Types.ObjectId,
//         ref: 'Listing',
//         required: true
//     },
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     checkIn: {
//         type: Date,
//         required: true
//     },
//     checkOut: {
//         type: Date,
//         required: true
//     }
// });

// module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    checkInDate: Date,
    checkOutDate: Date,
    totalPrice: Number,
});

module.exports = mongoose.model("booking", bookingSchema);
