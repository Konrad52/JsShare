import fs = require("fs");
import path = require("path");
import { JSS_HASHER } from "./hasher";

export function replaceAll(value: string, search: string, replace: string): string {
    if (replace === undefined) {
        return value.toString();
    }
    return value.split(search).join(replace);
}

export function addFile(args): any {
    var filelist = fs.readFileSync(path.join(__dirname, "./../filelist.json"));
    var filelistJSON = JSON.parse(filelist.toString());

    var hash = JSS_HASHER.hash(replaceAll(args[0].split("").reverse().join(""), "\\", ""), 64);
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

    return {
        filelistJSON,
        hash,
        pass
    };
}