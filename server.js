const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const morgan = require('morgan');

module.exports = app;

app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler());
app.use(morgan('dev'));
app.use(express.static('public'));

const PORT = process.env.PORT || 4000;

// Inport API Router and mount it at all routes starting at '/api'
const apiRouter = require('./api/api');
app.use('/api', apiRouter);

app.listen(PORT, (req, res, next) => {
  console.log('Server is running on port ' + PORT);
})