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
app.use(cors());
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
    });
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });


  } catch (err) {
    console.log(err);
  }
};

start();




// const runSqlScript = require("./DB/db-scripts"); // Підключення до модулю виконання SQL-скриптів
// const scriptPath = "./DB/create-database.sql";
// runSqlScript(scriptPath); // Виклик функції для виконання SQL-скрипта