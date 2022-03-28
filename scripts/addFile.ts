import fs = require("fs");
import path = require("path");

import { JSS_LOGGER } from "../ts/logger";
import { addFile } from "../ts/util";

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

const file = addFile(args);
fs.writeFileSync(path.join(__dirname, "./../filelist.json"), JSON.stringify(file.filelistJSON));

JSS_LOGGER.log(`File added successfully as \"${file.hash}\" with the password \"${file.pass}\".`);

JSS_LOGGER.reset();