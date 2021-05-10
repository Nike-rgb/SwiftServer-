const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const mkcert = require("mkcert");
const colors = require("colors");

async function setHTTPS() {
  try {
    const ca = await mkcert.createCA({
      organization: "SwiftServer",
      countryCode: "NP",
      state: "Province 1",
      locality: "Pashupatinagar",
      validityDays: 365,
    });

    return mkcert.createCert({
      domains: ["127.0.0.1", "localhost"],
      validityDays: 365,
      caKey: ca.key,
      caCert: ca.cert,
    });
  } catch (err) {
    throw err;
  }
}

const app = express();

const no_file_found_markup = `<h1 style="margin-top:220px;color:red; text-align:center;">
No HTML file found to serve.</h1>
<p style="width:60%;margin:auto;text-align:center;">
Make sure you have 'index.html' file in the root directory of your project.
Or include the 'fileName' option if the html file has a different name.
</p>
<a target="_blank" href="/Swift_serverREADME.html">
<div style="text-align:center;margin-top:50px;">
Read the complete guide on using SwiftServer.
</div>
</a>
`;

app.use((req, res, next) => {
  res.set({
    "X-powered-by": "SwiftServer",
  });
  next();
});

//serving static files
function serveStatic(directory, public) {
  app.use(express.static(__dirname + "/public"));
  if (public) app.use(express.static(`${directory}/${public}`));
  app.use(express.static(directory));
}

colors.setTheme({
  highlight: "white",
  info: "cyan",
  link: "green",
  note: "yellow",
  error: "red",
});

function logInfo(options) {
  const { PORT, fileName, public, secure } = options;
  console.log(
    `SwiftServer serving `.info +
      `${fileName}`.highlight +
      ` on port ${PORT} \n
  You have set the following settings:`.info
  );
  console.log(`
  PORT : ${PORT ? PORT : "3000 (default)"} 
  fileName : ${fileName ? fileName : "index.html (default)"}
  public : ${public ? public : "root (default)"}
  secure : ${
    secure
      ? secure +
        "\n" +
        `Even though secure is true, your browser will still show insecure which is fine. 
The site will be running on https nevertheless.`.note
      : "false"
  }
  `);
  console.log(
    `Go to ${secure ? "https".link.underline : "http".link.underline}` +
      `://localhost:${PORT}`.link.underline +
      ` on your browser`
  );
}

async function swiftServer(options) {
  const { PORT, fileName, public, secure } = options;
  if (secure !== true) app.listen(PORT || 3000);
  else {
    try {
      const cert = await setHTTPS();
      https
        .createServer({ cert: cert.cert, key: cert.key }, app)
        .listen(PORT || 3000);
    } catch (err) {
      app.listen(PORT || 3000);
      console.log(
        "\nSomething went wrong. Couldn't start https. Server defaulted to http. Try running the server again.\n"
          .error
      );
      options.secure = false;
    }
  }
  const directory = __dirname + "/.." + "/..";
  logInfo(options);
  serveStatic(directory, public);
  app.get("/*", (req, res) => {
    fs.access(path.join(directory, fileName), (err) => {
      if (err) res.send(no_file_found_markup);
      else res.sendFile(path.join(directory, fileName));
    });
  });
}

module.exports = swiftServer;
