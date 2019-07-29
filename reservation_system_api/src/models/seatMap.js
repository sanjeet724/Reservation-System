const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatMapSchema = new Schema(
  {
    rows: {
      type: Number,
      required: true
    },
    cols: {
      type: Number,
      required: true
    }
  },
  {
    collection: 'seat_map'
  }
);

const SeatMap = mongoose.model('SeatMap', seatMapSchema);

module.exports = SeatMap;
