var fs = require("fs");
var downloader = require("./index.js");

var demoUrl = "https://oload.tv/embed/L2OoLbU09Ac/";

(async function() {
  try {
    console.log("Starting test...");

    await downloader.download(demoUrl, "dummy.mp4");
    fs.unlinkSync("dummy.mp4");

    console.log("Success!");
  } catch (error) {
    throw new Error("Oops, an error occurred!", error);
  }
})();
