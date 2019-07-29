const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');
const Seat = require('../models/seats');
const SeatMap = require('../models/seatMap');

router.get('/state', async (req, res) => {
  try {
    const seats = await Seat.find({}, { seat_id: 1, booked: 1, _id: 0 });
    const seatData = {
      seats: seats
    };
    res.send(seatData).end();
  } catch (e) {
    res.status(400).send('Cannot fetch records');
  }
});

router.get('/state/seatMap', async (req, res) => {
  try {
    const seatMap = await SeatMap.find({}, { rows: 1, cols: 1, _id: 0 });
    const seatMapConfig = {
      config: seatMap[0]
    };
    res.send(seatMapConfig).end();
  } catch (e) {}
});

router.get('/state/:id', async (req, res) => {
  const seat_id = req.params.id;
  try {
    const seat = await Seat.find({ seat_id: seat_id });
    res.send(seat).end();
  } catch (e) {
    res.status(400).send(`Cannot find seat`);
  }
});

router.post('/state', async (req, res) => {
  const { row_id, col_id } = req.body;
  const newSeat = new Seat({
    row_id: row_id,
    col_id: col_id,
    seat_id: 'seat-' + row_id + '-' + col_id
  });

  try {
    await newSeat.save();
    logger.log('info', 'New seat added');
    res.send('New seat added');
  } catch (e) {
    logger.error('error', 'Cannot add new seat');
    res.status(400).send(`Cannot add new seat`);
  }
});

router.put('/state', async (req, res) => {
  try {
    const { seat_id, status } = req.body;
    const seat = await Seat.findOneAndUpdate(
      { seat_id: seat_id },
      { booked: status },
      {
        new: true
      }
    );
    res.send(seat).end();
  } catch (e) {
    console.log(e);
    logger.error('error', 'Cannot update seat selection');
    res.status(400).send(`Cannot update seat selection`);
  }
});

module.exports = router;
