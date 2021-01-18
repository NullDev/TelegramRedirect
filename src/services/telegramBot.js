"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Dependencies
let TelegramBot = require("node-telegram-bot-api");

// Utils
let config = require("../utils/configHandler").getConfig();
let log = require("../utils/logger");

let bot = new TelegramBot(config.telegram.bot_token, { polling: true });

let validUrl = url => !!(new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$", "i")).test(url);

module.exports = async function(app){
    bot.on("message", msg => {
        if (!msg.text || !validUrl(msg.text)){
            log.warn(`Invalid URL (${msg.text}) prodided by User ${msg.from.username} (${msg.from.id})`);
            return bot.sendMessage(msg.chat.id, "This seems like an Invalid URL =(");
        }
        log.info(`Set new URL to: ${msg.text}`);
        return app.get("/", (req, res) => res.status(301).redirect(msg.text));
    });
};
