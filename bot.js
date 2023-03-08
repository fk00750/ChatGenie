const ChatGPT = require("./chatgpt.bot");
const { Client, RemoteAuth, LocalAuth } = require("whatsapp-web.js");
// Require database
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
// qr code
const qrcode = require("qrcode-terminal");

const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  const client = new Client({
    puppeteer: {
      args: ["--no-sandbox"],
    },
    authStrategy: new LocalAuth({
      clientId: undefined,
      dataPath: "./",
    }),
  });

  // remote session saved
  client.on("remote_session_saved", async () => {
    console.log("remote session saved");
  });

  // When the client emits a "qr" event, generate a QR code with the provided data.
  client.on("qr", async (qr) => {
    qrcode.generate(qr, { small: true });
  });

  // When the client is successfully authenticated, log a message to the console.
  client.on("authenticated", () => {
    console.log("Authenticated");
  });

  // When the client is ready to send and receive messages, log a message to the console.
  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", async (message) => {
    const body = message.body;
    message.reply("Please wait");
    const reply = await ChatGPT(body);
    if(reply) {
      message.reply(reply);
    } else {
      message.reply("something went wrong")
    }
  });

  await client.initialize();
  console.log("Successfully initialized");
  // mongoose.connect(MONGO_URI).then(async () => {
  // });
  //   console.log("Connected to mongodb database");
  //   const store = new MongoStore({ mongoose: mongoose });
};

(async () => {
  start();
})();
