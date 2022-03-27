import fs = require("fs");
import path = require("path");
import { JSS_LOGGER } from "./logger";

export var fileManagerInstance: JSS_FILEMANAGER = null;

export class JSS_FILEMANAGER {
    express: any;
    app: any;    

    filelist: Buffer;
    filelistJSON: any;

    public static init(express: any, app: any) {
        if (fileManagerInstance == null)
            fileManagerInstance = new JSS_FILEMANAGER();
        
        fileManagerInstance.express = express;
        fileManagerInstance.app = app;
        fileManagerInstance.setup();        
    }

    private loadFile() {
        this.filelist = fs.readFileSync(path.join(__dirname, "./../filelist.json"));
        this.filelistJSON = JSON.parse(this.filelist.toString());
    }

    public setup() {
        let fsWait = false;
        fs.watch(path.join(__dirname, "./../filelist.json"), (event, filename) => {
            if (fsWait)
                return;

            this.filelist = null;
            this.filelistJSON = null;
            fsWait = true;
            setTimeout(() => { this.loadFile(); fsWait = false; }, 100);
            JSS_LOGGER.log("fileslist.json has been reloaded!");
        });

        this.app.get("/download", (req, res) => {
            var file = req.query["file"];
            var pass = req.query["pass"];

            if (file == null || pass == null) {
                res.send("Incorrect request body!");
                return;
            }

            var jsonFile = this.filelistJSON[file];
            if (jsonFile == null || jsonFile["pass"] != pass) {
                res.send("Incorrect file hash or password!");
                return;
            }

            res.download(jsonFile["path"]);
        });

        this.loadFile();
    }
}