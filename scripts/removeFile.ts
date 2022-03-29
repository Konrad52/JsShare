import fs = require("fs");
import path = require("path");

import { removeFile } from "../ts/util";
import { JSS_HASHER } from "./../ts/hasher";
import { JSS_LOGGER } from "./../ts/logger";

const args = process.argv.splice(2);

if (args.length != 1)
{
    JSS_LOGGER.error("Incorrect amount of parameters!");
    process.exit();
}

const result = removeFile(args[0]);

fs.writeFileSync(path.join(__dirname, "./../filelist.json"), JSON.stringify(result.filelistJSON));

JSS_LOGGER.log(`File \"${result.hash}\" has been removed successfully.`);

JSS_LOGGER.reset();