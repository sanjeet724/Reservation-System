const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('./helpers/logger');

require('dotenv').config();

const testRoute = require('./routes/testRoute');
const state = require('./routes/state');

const app = express();
const port = process.env.PORT;
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false });
const connection = mongoose.connection;

connection.once('open', (err, res) => {
  if (err) {
    logger.log('warn', `Cannot connect to Mongo`);
    return;
  }
  logger.log('info', 'MongoDB database connection established');
});

// app settings
app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// use routes
app.use(testRoute);
app.use(state);

app.get('/', (req, res) => {
  logger.log('info', 'Reservation API is up');
  res.send(`Reservation API is up`).end();
});

app.listen(port, () => {
  logger.log('info', `App running on port ${port}`);
});
