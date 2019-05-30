/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import XLSX from 'xlsx';
import saveAs from 'file-saver';

const initialState = {};

// eslint-disable-next-line
function pad(n) {
  return n < 10 ? `0${n}` : n;
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  // eslint-disable-next-line no-bitwise
  for (let i = 0; i < s.length; i += 1) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function download(rawOutput) {
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Weighted Word Frequency');

  const wsData = [];
  rawOutput.split('\n').forEach((line) => {
    wsData.push(line.split('\t'));
  });
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  for (let C = 1; C < XLSX.utils.decode_range(ws['!ref']).e.c; C += 1) {
    for (let R = 1; R < XLSX.utils.decode_range(ws['!ref']).e.r; R += 1) {
      const ref = XLSX.utils.encode_cell({ r: R, c: C });
      ws[ref].t = 'n';
    }
  }
  console.log('ws', ws);

  wb.Sheets['Weighted Word Frequency'] = ws;
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours();
  const min = currentDate.getMinutes();
  const sec = currentDate.getSeconds();
  const mmddyyyy = pad(month + 1) + pad(date) + year.toString().substr(2, 3);
  const hhmmss = `${pad(hour)}h${pad(min)}m${pad(sec)}s`;

  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `Weighted Word Frequency ${mmddyyyy} ${hhmmss}.xlsx`);
}

function onCalculateClick() {
  const rawData = document.getElementById('tadata').value;
  const dataSplitLine = rawData.split('\n');
  const header = dataSplitLine[0].split('\t');
  const rawDataArray = [];
  const words = [];
  let output = '';

  //* fill raw data array headers
  for (let i = 0; i < header.length; i += 1) {
    rawDataArray[i] = [];
    rawDataArray[i][0] = header[i];
  }
  console.log(header);
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
  rawDataArray[0].forEach((line, index) => {
    if (index !== 0) {
      line.split(' ').forEach((word) => {
        if (!words.includes(word) && word !== '') words.push(word);
      });
    }
  });

  words.sort();

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
  words.forEach((element) => {
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
