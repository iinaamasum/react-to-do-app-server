const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('TO DO SERVER RUNNING');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
