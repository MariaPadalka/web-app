require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware); //always connect last

const PORT = process.env.PORT || 3000;

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

app.get("/api", (req, res) => {
  res.json({message:["Hello, World!"]});
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(()=>{
      console.log('Connected to MongoDB');
    });
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });


  } catch (err) {
    console.log("MongoBD error");
    console.log(err);
  }
};

start();