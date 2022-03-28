import path = require("path");
import fs = require("fs");

import { fileManagerInstance } from "./files";
import { JSS_CONFIG } from "../config";
import { JSS_HASHER } from "./hasher";
import { addFile, replaceAll } from "./util";
import { JSS_LOGGER } from "./logger";

const fileRow = `
<x-block class="download-item-block" x-w="100%" x-bg-c="#333" style="border-radius: 2em;">
<x-container class="download-item">
    <x-block class="download-button" x-h="3em" x-w-min="12em" x-bg-c="#404040" style="border-radius: 2em;">
        <x-bcenter x-t-c="white" style="user-select: none;">
            @{DATE}
        </x-bcenter>
    </x-block>
    <x-block x-t-c="white" x-w="100%" x-h="3em">
        <x-vcenter x-w="100%" x-m-left="1em" x-m-right="1em" style="user-select: none;">
            @{FILENAME}
        </x-vcenter>
    </x-block>
    <div style="display: flex;" x-w="100%" x-jc="right">
        <x-button class="download-button" x-h="3em" x-w-min="8em" x-bg-c="#404040" style="border-radius: 2em 0em 0em 2em;" onclick="window.location += '@{DOWNLOAD}';">
            <x-bcenter x-t-c="white">
                Download
            </x-bcenter>
        </x-button>
        <x-button x-h="3em" x-w-min="2em" x-w-max="2em" x-bg-c="#404040" style="border-radius: 0em 2em 2em 0em;" onclick="copy('http://@{IP}:@{PORT}/@{DOWNLOAD}'); jxgTooltip('@{DOWNLOAD}');">
            <x-bcenter x-t-c="white">
                ⎘
            </x-bcenter>
            <x-tooltip x-name="@{DOWNLOAD}" x-visible="false">
                @{TOOLTIP_MESSAGE}
            </x-tooltip>
        </x-button>
    </div>
</x-container>
</x-block>
<x-block class="media-font-size" style="height: 0.5em; width: 100%"></x-block>`;

var instance: JSS_PAGES = null;

class JSS_SESSION {
    id: string;

    constructor (id: string) {
        this.id = id;
    }
}

export class JSS_PAGES {
    express: any;
    app: any;    

    sessions: JSS_SESSION[] = [];

    public static init(express: any, app: any) {
        if (instance == null)
            instance = new JSS_PAGES();
        
        instance.express = express;
        instance.app = app;
        instance.setup();        
    }

    private checkSession(req: any): boolean {
        var user = req.cookies["user"];
        var sessionid = req.cookies["sessionID"];
        return !(sessionid == undefined || this.sessions[user] == undefined || !(this.sessions[user].id === sessionid));
    }

    private isLocalhost(req: any): boolean {
        return req.socket.remoteAddress.includes("127.0.0.1");
    }

    public setup() {   
        var ip = "";
        
        const randomChar = ():string => { return String.fromCharCode(Math.round(Math.random() * 255)) };
        const randomString = (length: number):string => { var result = "";for(var x=0; x<length; x++) result+=randomChar();return result; };

        /* Shameless copy: https://stackoverflow.com/questions/20273128/how-to-get-my-external-ip-address-with-node-js/24608249 */
        var http = require('http');
        http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
            resp.on('data', function(_) {
                ip = _;
            });
        });
        this.app.post("/login", (req, res) => {
            var loginName = req.body["login"];
            var loginPassword = req.body["pass"];

            var userlist = JSON.parse(fs.readFileSync(path.join(__dirname, `./../users.json`)).toString());
            if (typeof userlist[loginName] != 'undefined' && userlist[loginName]["pass"] === JSS_HASHER.hashWithSalt(loginPassword, loginName, 32)) {
                var time = new Date();
                var sessionid = JSS_HASHER.hash(time.getSeconds() + loginName.substring(0, 4) + randomString(4) + time.getMilliseconds() + loginPassword.substring(0, 4) + randomString(8), 32);
                res.cookie("user", loginName,  {maxAge: JSS_CONFIG.sessionLength});
                res.cookie("sessionID", sessionid, {maxAge: JSS_CONFIG.sessionLength});
                this.sessions[loginName] = new JSS_SESSION(sessionid);
                res.redirect("/");
                return;
            }
            var loginPage = fs.readFileSync(path.join(__dirname, `./../html/login.html`)).toString()
                .replace("@{MESSAGE}", "<div style='color:#f66'>Incorrect username or password!</div>");
            res.send(loginPage);
            return;
        });
        this.app.post("/addfile", (req, res) => {
            if (!this.checkSession(req) && !this.isLocalhost(req)) {
                res.send("Missing credentials!");
                return;
            }
            if (req.body["file"] == undefined) {
                res.send("Specify a file first!");
                return;
            }
            const file__ = replaceAll(req.body["file"], "\"", "");

            JSS_LOGGER.log(`Attempted to add file "${file__}".`);

            if (!fs.existsSync(file__)) {
                JSS_LOGGER.error("The provided file does not exist!");
            }

            const result = addFile([file__]);
            fs.writeFileSync(path.join(__dirname, "./../filelist.json"), JSON.stringify(result.filelistJSON));

            JSS_LOGGER.log(`The file was added successfully as "${result.hash}" with the password "${result.pass}".`);
            
            setTimeout((() => {
                res.redirect("/");
            }), 200);
        });
        this.app.get("/", (req, res) => {
            var login = {
                name: "",
                local: false
            };

            if (this.isLocalhost(req)) {
                login.name = "localhost";
                login.local = true;
            }

            if (!login.local) {
                if (!this.checkSession(req)) {
                    var loginPage = fs.readFileSync(path.join(__dirname, `./../html/login.html`)).toString()
                        .replace("@{MESSAGE}", (login.local || req.secure) ? "Welcome back!" : "<div style='color:#f66'>We strongly advise against logging in with this insecure connection, because your password can easily be stolen. If possible, please use the HTTPS page instead, or log in using localhost.</div>");
                    res.send(loginPage);
                    return;
                } else {
                    login.name = req.cookies["user"];
                }
            }

            var indexPage = fs.readFileSync(path.join(__dirname, `./../html/index${(login.local || req.secure) ? "" : "_http"}.html`)).toString();

            var filelist = "";
            var files = fileManagerInstance.filelistJSON;
            Object.keys(fileManagerInstance.filelistJSON).forEach((file => {
                var curr = <string>files[<string>file];
                var filename = (curr["path"]).split("\\");
                filelist += fileRow.replace("@{DATE}", curr["date"])
                    .replace("@{FILENAME}", filename[filename.length - 1])
                    .replace("@{TOOLTIP_MESSAGE}", (login.local || req.secure) ? "Copied to clipboard!" : "Copy the field above!");
                filelist = replaceAll(filelist, "@{IP}", `${ip}`);
                filelist = replaceAll(filelist, "@{PORT}", `${JSS_CONFIG.httpPort}`);
                filelist = replaceAll(filelist, "@{DOWNLOAD}", `download?file=${file}&pass=${curr["pass"]}`);
            }));

            res.send(indexPage.replace("@{FILELIST}", filelist).replace("@{LOGIN}", login.name)); 
        });
        this.app.use(this.express.static(path.join(__dirname, "./../css/")));
        this.app.use(this.express.static(path.join(__dirname, "./../js/")));
    }
}