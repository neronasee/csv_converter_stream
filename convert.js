const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const csvToJson = require('./csvToJson');
const unzipFiles = require('./unzipFiles');
const readIntoOne = require('./readIntoOne');

const tempDir = path.join(__dirname, 'temp');
const tempFileName = 'temp.csv';
const outputDir = path.join(__dirname, 'output');
const outputFileName = 'result.json';

const convert = async (zipFilePath) => {
  try {
    await fs.emptyDir(tempDir);
    await fs.emptyDir(outputDir);

    await unzipFiles(zipFilePath, tempDir); 

    await readIntoOne(tempDir, tempDir, tempFileName); 

    await csvToJson(tempDir, tempFileName, outputDir, outputFileName); 

    await fs.remove(tempDir);

    console.log('Done');
  } catch (error) {
    console.log(error);
  }
};

module.exports = convert;