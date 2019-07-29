const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatSchema = new Schema({
  row_id: {
    type: Number,
    required: true
  },
  col_id: {
    type: Number,
    required: true
  },
  seat_id: {
    type: String,
    required: true
  },
  booked: {
    type: Boolean,
    required: false,
    default: false
  }
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
