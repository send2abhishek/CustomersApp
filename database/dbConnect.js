const mongoose = require("mongoose");
const config = require("config");
mongoose
  .connect(config.get("dburl"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((response) => {
    console.log(config.get("dbconnectMsg"));
  })
  .catch((err) => {
    console.log(config.get("dbConnectError", err.message));
  });
