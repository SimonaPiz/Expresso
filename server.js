const express = require('express');
const app = express();

module.exports = app;

const PORT = process.env.PORT || 4000;

app.listen(PORT, (req, res, next) => {
  console.log('Server is running on port ' + PORT);
})