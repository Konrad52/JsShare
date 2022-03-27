import { JSS_CONFIG } from "../config";

export const JSS_LOGGER = class {
    public static log(text: string) {
        console.log(`\u001b[38;5;232m\u001b[48;5;25m[${new Date().toTimeString().split(' ')[0]}][${JSS_CONFIG.prefix}][INF]\u001b[0m\u001b[37;1m ${text}`);
    }
    public static error(text: string) {
        console.log(`\u001b[38;5;232m\u001b[48;5;88m[${new Date().toTimeString().split(' ')[0]}][${JSS_CONFIG.prefix}][ERR]\u001b[0m\u001b[31;1m ${text}`);
    }
    public static warn(text: string) {
        console.log(`\u001b[38;5;232m\u001b[48;5;184m[${new Date().toTimeString().split(' ')[0]}][${JSS_CONFIG.prefix}][WRN]\u001b[0m\u001b[33;1m ${text}`);
    }
    public static reset() {
        console.log(`\u001b[0m`);
    }
}