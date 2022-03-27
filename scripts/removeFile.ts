import fs = require("fs");
import path = require("path");

import { JSS_HASHER } from "./../ts/hasher";
import { JSS_LOGGER } from "./../ts/logger";

const args = process.argv.splice(2);

if (args.length != 1)
{
    JSS_LOGGER.error("Incorrect amount of parameters!");
    process.exit();
}

var filelist = fs.readFileSync(path.join(__dirname, "./filelist.json"));
var filelistJSON = JSON.parse(filelist.toString());

var hash = JSS_HASHER.hash(args[0], 24);
delete filelistJSON[hash];

fs.writeFileSync(path.join(__dirname, "./filelist.json"), JSON.stringify(filelistJSON));

JSS_LOGGER.log(`File \"${hash}\" has been removed successfully.`);

JSS_LOGGER.reset();