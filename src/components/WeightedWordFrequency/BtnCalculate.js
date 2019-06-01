/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import saveAs from 'file-saver';
import Excel from 'exceljs';


const initialState = {};

// eslint-disable-next-line
function generateFileName() {
  function pad(n) {
    return n < 10 ? `0${n}` : n;
  }
  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours();
  const min = currentDate.getMinutes();
  const sec = currentDate.getSeconds();
  const mmddyyyy = pad(month + 1) + pad(date) + year.toString().substr(2, 3);
  const hhmmss = `${pad(hour)}h${pad(min)}m${pad(sec)}s`;
  return `Weighted Word Frequency ${mmddyyyy} ${hhmmss}.xlsx`;
}

function download(rawOutput) {
  //* create workbook and worksheet
  const wb = new Excel.Workbook();
  const ws = wb.addWorksheet('Weighted Word Frequency');


  //* add data to worksheet
  rawOutput.split('\n').forEach((line) => {
    const row = line.split('\t');
    //* delete last index of every row- ""
    row.pop();
    ws.addRow(row);
  });

  //* format data
  ws._rows.forEach((row, i) => {
    row._cells.forEach((cell, j) => {
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(cell.value)) {
        //* parse to float if cell value is a number
        cell.value = parseFloat(cell.value.toString());
        //* format if cell value has decimal
        if (cell.value % 1 !== 0) { cell.numFmt = '0.00;(-[Red]0.00)'; }
      }
      if (i !== 0 && j === 0) { cell.numFmt = '@'; }
    });
  });

  //* auto filter
  ws.autoFilter = {
    from: 'A1',
    to: {
      row: 1,
      column: ws._rows[0]._cells.length,
    },
  };

  //* headers format
  const row = ws.getRow(1);
  row.eachCell((cell) => {
    //* auto filter
    cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    cell.font = {
      size: 14,
      bold: true,
    };
    //* bottom border
    cell.border = {
      bottom: { style: 'thin' },
    };
    //* background
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB7DEE8' },
    };
  });

  //* freeze top row
  ws.views = [
    {
      state: 'frozen', ySplit: 1,
    },
  ];

  //* resize column widths
  ws.columns.forEach((column, index) => {
    if (index === 0) { column.width = 30; } else column.width = 20;
  });

  //* download
  wb.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, generateFileName());
  });
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
    const data = element.trim();
    output += `${data}\t`;
  });
  output += '\n';

  //* calculations
  words.forEach((word) => { //* for each word in words list
    output += `${word}\t`; //* add word\t to output
    for (let i = 1; i < rawDataArray.length; i += 1) {
      let sum = 0;
      for (let j = 1; j < rawDataArray[i].length; j += 1) {
        if (
          rawDataArray[0][j] !== undefined //* line must not be undefined
          && rawDataArray[0][j].includes(word) //* line must include word
          && (rawDataArray[0][j].match(new RegExp(`^${word}$`, 'g')) //* only word in line
          || rawDataArray[0][j].match(new RegExp(`.+\\s${word}\\s.+`, 'g')) //* between two words
          || rawDataArray[0][j].match(new RegExp(`^${word}\\s.+`, 'g')) //* first word in line
          || rawDataArray[0][j].match(new RegExp(`.+\\s${word}$`, 'g'))) //* last word in line
        ) { sum += rawDataArray[i][j]; } //* add value to sum if true
      }
      output += `${sum}\t`; //* add sum to output
    }
    output += '\n'; //* add \n to output
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
