const app = require("./index");
const http = require("http");
const config = require("config");
const server = http.createServer(app);
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(config.get("App") + port);
});
