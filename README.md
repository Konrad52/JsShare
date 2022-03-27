# JsShare
### Share files from your local computer with just one open port and a url! 💻

Basically this app allows you to select files on your machine, and assign a url to them.
Anyone with the url is able to download it if:
- Your computer is running. (duh)🐹
- This application is running.
- And the selected port for the http server is forwarded on your router.

## Usage
First of all, you need to access the main webpage using `localhost:<http port>`
The default port is 25563.

On this website you have a few options. If you open it on your local computer
then no login is necessary, and you can copy any shared file's url that you can
send to a friend, or download the said file.

On the other hand, if you open it from outside (for example the person you sent the url to)
then you will be prompted to log in. The method of adding users is written down below.
With a proper account you can access the same list as the localhost.

The download link to any file does not need login in order to work.

❗ Be aware of the security risks of logging in while in http mode! ❗
I only advise the use of the main page outside of the localhost address when https is enabled.
Otherwise it's:
- Unnecessary.
- The passwords become stealable.

( HTTPS is possible by editing the config.ts file and adding the necessary certeficates. )

## Configuration
To edit the configuration you need to modify the config.ts file.
```
export const JSS_CONFIG = {
    prefix: "JSS",                 /* Program prefix in console */
    httpPort: 25563,               /* HTTP website's port */
    httpsPort: 8080,               /* HTTPS website's port */
    https: true,                   /* True, if you have https certificates and a domain ready. */
    sessionLength: 1000*60*60*12   /* Length in milliseconds for a login session. */
}
```

## Installation

1. Download the repo as a .zip
2. Extract to the desired location
3. Run:
```
  npm install
```
4. Done!

## Commands

```
  npm start
```
- Starts the main application.

```
  npm addUser <name> <password>
```
- Adds an admin user that can access the whole file list.
  
```
  npm addFile <path>
```
- Adds the desired file to the website.
 
```
  npm removeFile <path>
```
- Removes the desired file from the webpage. If the file isn't shared anyway it won't do anything.
