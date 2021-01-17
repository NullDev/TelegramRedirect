"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Dependencies
let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let helmet = require("helmet");

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

let app = express();

log.info(`Starte ${appname}...`);
const config = conf.getConfig();

app.enable("trust proxy");

app.set("port", portHandler(config.server.port));

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

process.on("unhandledRejection", (err, promise) => {
    log.error("Unhandled rejection (promise: " + promise + ", reason: " + err + ")");
});

app.listen(app.get("port"), (err) => {
    if (err){
        log.error(`Error on port ${app.get("port")}: ${err}`);
        process.exit(1);
    }
    log.info(`Listening on port ${app.get("port")}...`);
});
