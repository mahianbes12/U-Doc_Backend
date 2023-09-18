const express = require("express");
const app = express();
const mongoose = require('mongoose');
const paths = require("./U-Doc_Backend/routes/authroutes");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const mongoConn = process.env.MONGO_CONN;

app.use("/api/", paths);
app.use(bodyParser.json());

mongoose.connect(mongoConn, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
