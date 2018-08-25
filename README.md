# openload-downloader

This module helps you download openload videos to your server easily using node.js

## Installation

This module can be installed via npm:

```sh
$ npm install --save openload-downloader
```

## Usage

```js
var downloader = require("openload-downloader");
```

### Functions

#### downloader.download(videoURL, outputFile)

- **videoURL:** URL of the openload/oload video
- **outputFile:** Output file path

```js
var downloader = require("openload-downloader");

(async function() {
  await downloader.download("https://oload.tv/embed/<VIDEO-ID>", "dummy.mp4");
  console.log("Download completed");
})();
```

or if you want to use it with _.then()_ instead of async/await:

```js
var downloader = require("openload-downloader");

downloader.download("https://oload.tv/f/<VIDEO-ID>", "dummy.mp4").then(() => {
  console.log("Download completed");
});
```
