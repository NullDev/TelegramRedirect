"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Dependencies
let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let helmet = require("helmet");

// Services
let watcher = require("./services/telegramBot");
let noCache = require("./services/noCache");

// Utils
let conf = require("./utils/configHandler");
let log = require("./utils/logger");
let portHandler = require("./utils/portHandler");

let appname = conf.getName();
let version = conf.getVersion();

console.log(
    "\n" +
    " #" + "-".repeat(14 + appname.length + version.toString().length) + "#\n" +
    " # " + appname + " v" + version + " gestartet #\n" +
    " #" + "-".repeat(14 + appname.length + version.toString().length) + "#\n"
);

log.info(`Starte ${appname}...`);
const config = conf.getConfig();

if ((config.telegram.bot_token).replace(/\s/g, "") === ""){
    log.error("No Telegram Token specified in config. Exiting...");
    process.exit(1);
}

let app = express();

app.enable("trust proxy");

app.set("etag", false);
app.set("port", portHandler(config.server.app_port));

app.use(helmet());
app.use(noCache());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

process.on("unhandledRejection", (err, promise) => {
    log.error("Unhandled rejection (promise: " + promise + ", reason: " + err + ")");
});

watcher(app);

app.listen(app.get("port"), (err) => {
    if (err){
        log.error(`Error on port ${app.get("port")}: ${err}`);
        process.exit(1);
    }
    log.info(`Listening on port ${app.get("port")}...`);
});
