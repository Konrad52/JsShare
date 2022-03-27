import { JSS_FILEMANAGER } from "./../ts/files";
import { JSS_HASHER } from "./../ts/hasher";
import { JSS_LOGGER } from "./../ts/logger";
import { JSS_PAGES } from "./../ts/pages";

JSS_LOGGER.log("Initializing js-share...");

import { JSS_CONFIG } from "./../config";

JSS_LOGGER.log("Configs loaded!");

const express = require("express");
const https = require("https");
const http = require("http");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(require("cookie-parser")());
app.use(express.urlencoded({ extended: true }));

var key = null;
var cert = null;
var options = {
  key: key,
  cert: cert
};
var httpServer: any = null;
var httpsServer: any = null;
httpServer = http.createServer(app);
if (JSS_CONFIG.https) {
    key = fs.readFileSync(path.join(__dirname, './../certs/privkey.pem'));
    cert = fs.readFileSync(path.join(__dirname, './../certs/fullchain.pem'));
    httpsServer = https.createServer(options, app);
}

try {
    fs.writeFileSync("./users.json", `{"admin": {"pass": "KkZs3A7Fdt2IbM8IoQsYw3BRr6zbx6Mf", "comment_": "This is a default account. You should delete this. It's password is admin1234"}}`, { flag: 'wx' });
    JSS_LOGGER.log("No users.json file detected. Added default one.");
} catch (err) {
    if (err) {
        if (err.code !== "EEXIST")
            JSS_LOGGER.error(err);
    }
}
try {
    fs.writeFileSync("./filelist.json", `{}`, { flag: 'wx' });
    JSS_LOGGER.log("No filelist.json file detected. Added default one.");
} catch (err) {
    if (err) {
        if (err.code !== "EEXIST")
            JSS_LOGGER.error(err);
    }
}

JSS_PAGES.init(express, app);
JSS_LOGGER.log("Page Manager initialized!");

JSS_FILEMANAGER.init(express, app);
JSS_LOGGER.log("File Manager initialized!");

if (JSS_CONFIG.https) {
    httpsServer.listen(JSS_CONFIG.httpsPort, () => {
        JSS_LOGGER.log(`JS-Share HTTPS is listening on port ${JSS_CONFIG.httpsPort}`);
    });
}
httpServer.listen(JSS_CONFIG.httpPort, () => {
    JSS_LOGGER.log(`JS-Share HTTP is listening on port ${JSS_CONFIG.httpPort}`);
});