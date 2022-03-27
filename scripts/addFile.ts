import fs = require("fs");
import path = require("path");

import { JSS_HASHER } from "../ts/hasher";
import { JSS_LOGGER } from "../ts/logger";

const args = process.argv.splice(2);

if (args.length != 1)
{
    JSS_LOGGER.error("Incorrect amount of parameters!");
    process.exit();
}

if (!fs.existsSync(args[0])) {
    JSS_LOGGER.error("The provided file does not exist!");
    process.exit();
}

var filelist = fs.readFileSync(path.join(__dirname, "./filelist.json"));
var filelistJSON = JSON.parse(filelist.toString());

var hash = JSS_HASHER.hash(args[0], 24);
var pass = JSS_HASHER.hash(args[0], 8);
var date = new Date();
filelistJSON[hash] = {
    path: args[0],
    pass: pass,
    /* Shameless copy "https://stackoverflow.com/questions/10632346/how-to-format-a-date-in-mm-dd-yyyy-hhmmss-format-in-javascript" */
    date: `${(date.getMonth()+1).toString().padStart(2, '0')}/${
            date.getDate().toString().padStart(2, '0')}/${
            date.getFullYear().toString().padStart(4, '0')} ${
            date.getHours().toString().padStart(2, '0')}:${
            date.getMinutes().toString().padStart(2, '0')}:${
            date.getSeconds().toString().padStart(2, '0')}`
};

fs.writeFileSync(path.join(__dirname, "./filelist.json"), JSON.stringify(filelistJSON));

JSS_LOGGER.log(`File added successfully as \"${hash}\" with the password \"${pass}\".`);

JSS_LOGGER.reset();