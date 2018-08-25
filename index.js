/**
 * @description Openload video downloader
 * @author Furkan Inanc
 * @version 1.0.0
 */

let fs = require("fs");
let puppeteer = require("puppeteer");
let request = require("request-promise");

/**
 * Returns the ID of the video
 * @param {String} openloadUrl URL of the Openload video
 * @returns {String}
 */
function captureVideoId(openloadUrl) {
  return openloadUrl.match(/\/(f|embed)\/([^?]+).*/)[2];
}

/**
 * Gets the raw URL of the Openload video
 * @param {String} openloadUrl URL of the Openload video
 * @returns {Promise<String>}
 */
async function scrapeVideoUrl(openloadUrl) {
  return new Promise(async (resolve, reject) => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    let source;

    /**
     * We will need to communicate with the page to get the raw video URL.
     * We will do it using console.log() on the page and checking the data
     * that is logged to see if it's what we need.
     */
    page.on("console", message => {
      try {
        source = JSON.parse(message.text()).videoUrl;
      } catch (error) {}
    });

    /**
     * Script will run until the page is fully loaded. Otherwise we may not be able to get
     * the URL.
     */
    await page.goto(openloadUrl, {
      waitUntil: "networkidle2"
    });

    /**
     * Retrieves the raw URL data from the page
     */
    await page
      .evaluate(() => {
        var videoChunk = $("#mediaspace_wrapper div>p")
          .last()
          .text();

        console.log(JSON.stringify({ videoUrl: videoChunk }));
      })
      .catch(error => {
        reject(new Error("Could not find a video on the specified URL"));
        return;
      });

    /**
     * No need to keep the browser open when the job is done. ;)
     */
    await browser.close();
    resolve(source);
  });
}

/**
 * A function to download Openload videos
 * @param {String} videoUrl URL of the Openload video
 * @param {String} outputFile Path to the output file
 */
module.exports.download = async (videoUrl, outputFile) => {
  return new Promise(async (resolve, reject) => {
    let videoBaseUrl = "https://oload.tv";
    let rawUrl = await scrapeVideoUrl(
      `${videoBaseUrl}/embed/${captureVideoId(videoUrl)}`
    ).catch(error => {
      reject(error);
      return;
    });

    let requestOptions = {
      uri: `${videoBaseUrl}/stream/${rawUrl}?mime=true`,
      encoding: "binary",
      method: "GET"
    };

    /**
     * Downloads the file to the desired output file.
     */
    request(requestOptions)
      .then(body => {
        let writeStream = fs.createWriteStream(outputFile);
        writeStream.write(body, "binary");

        writeStream.on("finish", () => {
          resolve();
        });

        writeStream.end();
      })
      .catch(error => {
        reject(new Error("Could not download the Openload video"));
        return;
      });
  });
};
