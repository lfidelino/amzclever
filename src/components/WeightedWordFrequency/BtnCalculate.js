/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';

const initialState = {};

function pad(n) {
  return n < 10 ? `0${n}` : n;
}

function download(output) {
  const csvOutput = [];
  output.split('\n').forEach((row) => {
    const rowToPush = new Array(0);
    row.split('\t').forEach((data) => {
      if (data !== '' && data !== undefined) rowToPush.push(data.replace('#', '').trim());
    });
    csvOutput.push(rowToPush);
  });

  const csvContent = `data:text/csv;charset=utf-8,${csvOutput.map(e => e.join()).join('\n')}`;
  csvContent.replace('Search', '');
  console.log(csvContent);

  const encodedUri = encodeURI(csvContent);

  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth(); // Be careful! January is 0 not 1
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours();
  const min = currentDate.getMinutes();
  const sec = currentDate.getSeconds();
  const mmddyyyy = pad(month + 1) + pad(date) + year.toString().substr(2, 3);
  const hhmmss = `${pad(hour)}h${pad(min)}m${pad(sec)}s`;
  const link = document.createElement('a');

  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `Weighted Word Frequency ${mmddyyyy} ${hhmmss}.csv`,
  );
  document.body.appendChild(link); // Required for FF

  link.click();
}

function onCalculateClick() {
  const rawData = document.getElementById('tadata').value;
  const dataSplitLine = rawData.split('\n');
  const header = dataSplitLine[0].split('\t');
  const rawDataArray = new Array(0);
  const word = new Array(0);
  let output = '';

  //* fill raw data array headers
  for (let i = 0; i < header.length; i += 1) {
    rawDataArray[i] = new Array(0);
    rawDataArray[i][0] = header[i];
  }

  //* fill raw data array search terms
  for (let i = 1; i < dataSplitLine.length; i += 1) {
    if (
      dataSplitLine[i].split('\t')[0] !== ''
      && dataSplitLine[i].split('\t')[0] !== undefined
    ) { rawDataArray[0][i] = dataSplitLine[i].split('\t')[0]; }
  }

  //* fill raw data array values- parse to float
  for (let i = 1; i < header.length; i += 1) {
    for (let j = 1; j < dataSplitLine.length; j += 1) {
      rawDataArray[i][j] = parseFloat(dataSplitLine[j].split('\t')[i]);
      if (
        dataSplitLine[j].split('\t')[i] === ''
        || dataSplitLine[j].split('\t')[i] === undefined
      ) {
        rawDataArray[i][j] = 0;
      }
    }
  }

  //* split rawDataArray[0][..] into separate words
  rawDataArray[0].forEach((element, index) => {
    if (index !== 0) {
      element.split(' ').forEach((element2) => {
        if (!word.includes(element2)) word.push(element2);
      });
    }
  });
  word.splice(word.indexOf(''), 1);
  word.sort();

  //* headers
  header.forEach((element) => {
    const data = element
      .replace('(', '')
      .replace('#', '')
      .replace(')', '')
      .trim();
    output += `${data}\t`;
  });
  output += '\n';

  //* calculations
  word.forEach((element) => {
    output += `${element}\t`;
    for (let i = 1; i < rawDataArray.length; i += 1) {
      let sum = 0;
      for (let j = 1; j < rawDataArray[i].length; j += 1) {
        if (
          rawDataArray[0][j] !== undefined
          && rawDataArray[0][j].includes(element)
        ) { sum += rawDataArray[i][j]; }
      }
      output += `${sum}\t`;
    }
    output += '\n';
  });

  //* download output
  download(output);
}

class BtnCalculate extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <React.Fragment>
        <button type="submit" id="calculate" onClick={onCalculateClick}>
          Calculate
        </button>
      </React.Fragment>
    );
  }
}

export default BtnCalculate;
