const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

http.createServer((req, res) => {
  if (req.url.startsWith("/feed?url=")) {
    const feedUrl = decodeURIComponent(req.url.replace("/feed?url=", ""));
    https.get(feedUrl, (feedRes) => {
      res.writeHead(200, { "Content-Type": "application/xml", "Access-Control-Allow-Origin": "*" });
      feedRes.pipe(res);
    }).on("error", (err) => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Feed fetch error: " + err.message);
    });
  } else {
    const file = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join(__dirname, file);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end("Not found"); return; }
      const ext = path.extname(filePath);
      const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };
      res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
      res.end(data);
    });
  }
}).listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
