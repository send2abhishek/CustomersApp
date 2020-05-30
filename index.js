const express = require("express");
const app = express();
const route = require("./Routes/appRoutes");
//Mongo DB connectivity
require("./database/dbConnect");
// cors enable
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//Middelware for enabling read json body
app.use(express.json());
app.use("/uploads", express.static("uploads"));
//Application routes
app.use("/customer", route);

//for unknown routes
app.use((req, res, next) => {
  const error = new Error("Page Not found");
  error.status = 404;
  next(error);
});

// Error Handler for express
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
