const fs = require('fs-extra');
const path = require('path');
const async = require('async');

const readIntoOne = (inputFolder, outputFolder, outputFileName) => {
  return new Promise((resolve, reject) => {
    const tasks = [];

    const files = fs.readdirSync(inputFolder);

    files.forEach((file) => {
      if (file.endsWith('csv')) {
        tasks.push(function (callback) {
          const fileReadStream = fs.createReadStream(path.join(inputFolder, file));
          const fileWriteStream = fs.createWriteStream(path.join(outputFolder, outputFileName));

          fileWriteStream.on('close', () => {
            callback(null)
          })

          fileReadStream.pipe(fileWriteStream);
        });
      }
    })

    async.series(tasks, (err, result) => {
      if (err) return reject(err);

      resolve('Concat finished')
    })
  })
};
module.exports = readIntoOne;