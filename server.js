const app = require("./app.js");
let { PORT } = require("./managers/env.js");

const http = require("http");

if (!PORT) console.warn("PORT may be set in .env (default: 4000)");

app.set("port", PORT);
const server = http.createServer(app);
server.on("listening", () => {
  const address = server.address();
  const bind =
    typeof address === "string"
      ? "pipe " + address
      : "http://localhost:" + PORT;
  console.log("listening on " + bind);
});

server.listen(PORT);
