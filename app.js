require("dotenv").config();
const { errors } = require("celebrate");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const limiter = require("./middlewares/limiter");
const routes = require("./routes");
const errorsMiddleware = require("./middlewares/errors");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3050, MONGO_URL = "mongodb://localhost:27017/bitfilmsdb" } =
  process.env;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

var whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost",
  "http://192.168.1.49:3000",
  "http://192.168.1.157:3000",
  "https://urchrr-mesto.nomoredomains.icu",
];

var corsOptionsDelegate = function (req, callback) {
  console.log("req: ", req);
  var corsOptions;
  if (whitelist.indexOf(req) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  console.log("!", corsOptions);
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(
  cors({ origin: corsOptionsDelegate, exposedHeaders: "*", credentials: true })
);
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use("/api", routes);
app.use(errorLogger);
app.use(errors());
app.use(errorsMiddleware);
app.listen(PORT);
