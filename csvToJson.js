const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { Transform } = require('stream');
const JSONStream = require('JSONStream');

const csvToJson = (inputFolder, inputFileName, outputFolder, outputFileName) => {
  return new Promise((resolve, reject) => {
    const converter = csv({
      toArrayString: true,
      delimiter: '||',
      encoding: 'utf8',
    });
    const csvReadStream = fs.createReadStream(path.join(inputFolder, inputFileName))
    const csvWriteStream = fs.createWriteStream(path.join(outputFolder, outputFileName))

    const transformStream = new Transform({
      writableObjectMode: true,
      readableObjectMode: true,
      transform(chunk, encoding, callback) {
        const { first_name, last_name, phone, amount, date, cc } = chunk;
        const formatedObj = {
          'name': `${last_name} ${first_name}`,
          'phone': phone.replace(/[^\d+]+/g, ''),
          'person': {
            'firstName': first_name,
            'lastName': last_name,
          },
          'amount': Number(amount),
          'date': moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          'costCenterNum': cc.replace(/[^\d+]+/g, ''),
        };
        
        this.push(formatedObj);
        callback();
      }
    });

    csvReadStream
      .on('error', () => reject('Error while reading'))
      .pipe(converter)
      .on('error', () => reject('Error while converting'))
      .pipe(JSONStream.parse('*'))
      .on('error', () => reject('Error while parsing'))
      .pipe(transformStream)
      .on('error', () => reject('Error while transforming'))
      .pipe(JSONStream.stringify('[', ',', ']'))
      .on('error', () => reject('Error while stringifying'))
      .pipe(csvWriteStream)
      .on('error', () => reject('Error while writing'))
      .on('finish', () => resolve('Finished'));
  })
};

module.exports = csvToJson;
