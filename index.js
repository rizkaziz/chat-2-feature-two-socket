const express = require("express");
const multer = require("multer");
const getRouter = require("./routes/route");
const http = require("http");
const socketIO = require("socket.io");
const sockjs = require("sockjs");

const app = express();
const server = http.createServer(app);
const port = 5001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

app.use("/api", uploads.array("file"), getRouter);

// Socket.IO setup
const io = socketIO(server, { path: "/socket.io" });
let totalReceivedBytes = 0;
io.on("connection", (socket) => {
  console.log("Socket.IO connection");
  socket.on("kirim-pesan", (msg) => {
    console.log(msg);
    socket.broadcast.emit("pesan-baru", msg);
    
    // totalReceivedBytes += Buffer.from(msg[0].chat).length;
    // console.log('Total Received Bytes:', totalReceivedBytes);
  });
});

// SockJS setup
const sockjs_echo = sockjs.createServer();
const clients = {};
sockjs_echo.on("connection", function (conn) {
  const clientId = generateUniqueId();
  clients[clientId] = conn;

  conn.on("data", function (message) {
    for (const id in clients) {
      if (id !== clientId) {
        clients[id].write(message);
      }
    }
  });
});

sockjs_echo.installHandlers(server, { prefix: "/sockjs" });

console.log("Server listening on port 5000");
server.listen(port);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
