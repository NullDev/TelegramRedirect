"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

process.env.NTBA_FIX_319 = "1";

// Dependencies
let TelegramBot = require("node-telegram-bot-api");

// Utils
let config = require("../utils/configHandler").getConfig();
let log = require("../utils/logger");

let bot = new TelegramBot(config.telegram.bot_token, { polling: true });

let validUrl = url => !!(new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")).test(url);

let URL = config.server.default_url;

module.exports = async function(app){
    app.get("/", (req, res) => res.status(301).redirect(URL));

    log.info("Bot listening...");
    bot.on("message", async msg => {
        if (String(msg.text).toLowerCase() === "/start") return bot.sendMessage(msg.chat.id, "Welcome!\nSend me an URL to which the server will redirect. 😄");

        if (!msg.text || !validUrl(msg.text)){
            log.warn(`Invalid URL (${msg.text}) provided by User ${msg.from.username} (${msg.from.id})`);
            return bot.sendMessage(msg.chat.id, "This seems like an Invalid URL. 😅 \nMake sure the URL's start with `http(s)://`", {
                parse_mode: "Markdown"
            });
        }
        log.info(`Set new URL to: ${msg.text}`);
        URL = msg.text;
        return bot.sendMessage(msg.chat.id, "New link has been set! 😁");
    });
};
