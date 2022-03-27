import fs = require("fs");
import path = require("path");

import { JSS_HASHER } from "./../ts/hasher";
import { JSS_LOGGER } from "./../ts/logger";

const args = process.argv.splice(2);

if (args.length != 2)
{
    JSS_LOGGER.error("Incorrect amount of parameters!");
    process.exit();
}

var users = fs.readFileSync(path.join(__dirname, "./../users.json"));
var usersJSON = JSON.parse(users.toString());

var pass = JSS_HASHER.hashWithSalt(args[1], args[0], 32);
usersJSON[args[0]] = {
    pass: pass,
};

fs.writeFileSync(path.join(__dirname, "./../users.json"), JSON.stringify(usersJSON));

JSS_LOGGER.log(`Users added successfully as \"${args[0]}\" with the password \"${pass}\".`);

JSS_LOGGER.reset();