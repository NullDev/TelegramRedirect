"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/* eslint-disable curly */

process.env.NTBA_FIX_319 = "1";

// Dependencies
let TelegramBot = require("node-telegram-bot-api");

// Utils
let config = require("../utils/configHandler").getConfig();
let log = require("../utils/logger");

let bot = new TelegramBot(config.telegram.bot_token, { polling: true });

const validUrl = url => !!(new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")).test(url);
const prefixMatch = new RegExp(`(${config.telegram.link_prefix})\\s?`, "gi");

let URL = config.server.default_url;

module.exports = async function(app){
    app.get("/", (req, res) => res.status(301).redirect(URL));

    log.info("Bot listening...");
    bot.on("message", async msg => {
        if (String(msg.text).toLowerCase() === "/start") return bot.sendMessage(msg.chat.id, config.telegram.messages.start, {
            parse_mode: "Markdown"
        });

        if (!(msg.text).includes(config.telegram.link_prefix)) return bot.sendMessage(msg.chat.id, config.telegram.messages.no_prefix_provided, {
            parse_mode: "Markdown"
        });

        let uri = (msg.text).replace(prefixMatch, "");

        if (!validUrl(uri)){
            log.warn(`Invalid URL (${uri}) provided by User ${msg.from.username} (${msg.from.id})`);
            return bot.sendMessage(msg.chat.id, config.telegram.messages.invalid_url, {
                parse_mode: "Markdown"
            });
        }
        log.info(`Set new URL to: ${uri}`);
        URL = uri;
        return bot.sendMessage(msg.chat.id, config.telegram.messages.new_link_set, {
            parse_mode: "Markdown"
        });
    });
};
