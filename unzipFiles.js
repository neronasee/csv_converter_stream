const extract = require('extract-zip');

const unzipFiles = (inputFilePath, outputFolder) => {
  return new Promise((resolve, reject) => {
    extract(inputFilePath, {dir: outputFolder}, (err) => {
      if (err) return reject(err);

      resolve('Successful unzip');
    });
  });
};

module.exports = unzipFiles;