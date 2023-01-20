const { app, BrowserWindow, clipboard } = require("electron");
const axios = require("axios");
const prompt = require("electron-prompt");
const fs = require("fs");
const path = require("path");

let window;

app.disableHardwareAcceleration();
const ad = path.join(app.getPath("appData"), "token.t");
const adex = fs.existsSync(ad);

function axiosed(r) {
  axios(`https://lafeview.oein.kr/account?token=${r}`).then((v) => {
    let { data } = v;
    console.log(data);
    if (data.id == "FUCKYOU") {
      app.quit();
      process.exit(0);
    } else {
      if (adex == false) fs.writeFileSync(ad, r, "utf-8");
      let alre = clipboard.readText("clipboard");
      clipboard.writeText(data.id, "clipboard");
      window.webContents.executeJavaScript(
        `document.querySelector("#root > div > div.sc-foDcoF.fiDYcO > div > form > div:nth-child(1) > div > input").focus()`
      );
      window.webContents.paste();
      setTimeout(() => {
        window.webContents.executeJavaScript(
          `document.querySelector("#root > div > div.sc-foDcoF.fiDYcO > div > form > div:nth-child(2) > div > input").focus()`
        );
        setTimeout(() => {
          clipboard.writeText(data.pw, "clipboard");
          window.webContents.paste();
          setTimeout(() => {
            clipboard.writeText(alre, "clipboard");
            window.webContents.executeJavaScript(
              `document.querySelector("#root > div > div.sc-foDcoF.fiDYcO > div > form > button").click()`
            );
            window.webContents.once("page-title-updated", () => {
              window.show();
            });
          }, 100);
        }, 100);
      }, 100);
    }
  });
}

function signin() {
  if (adex) axiosed(fs.readFileSync(ad, "utf8").toString());
  else
    prompt({
      title: "Auth Token",
      label: "Lafel TOKEN :",
      value: "",
      inputAttrs: {
        type: "text",
      },
      type: "input",
    }).then((r) => {
      if (r === null) {
        app.quit();
        process.exit(0);
      } else {
        axiosed(r);
      }
    });
}

function main() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: false,
      nodeIntegration: false,
      contextIsolation: true,
      partition: `partition:${Math.random()}`,
    },
    show: false,
  });

  app.commandLine.appendSwitch();
  window.loadURL("https://laftel.net/auth/email");
  window.webContents.once("did-finish-load", signin);
}

app.whenReady().then(main);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
  fs.rmSync(app.getPath("sessionData"), { recursive: true, force: true });
  console.log("Window closed");
  process.exit(0);
});
