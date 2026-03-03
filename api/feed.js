const https = require("https");

module.exports = (req, res) => {
  const feedUrl = req.query.url;
  if (!feedUrl || !feedUrl.startsWith("https://feeds.presspublish.io/")) {
    res.status(400).send("Invalid feed URL");
    return;
  }

  https.get(feedUrl, (feedRes) => {
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Access-Control-Allow-Origin", "*");
    feedRes.pipe(res);
  }).on("error", (err) => {
    res.status(500).send("Feed fetch error: " + err.message);
  });
};
