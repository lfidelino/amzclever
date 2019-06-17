/* eslint-disable no-restricted-globals */
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

function generateAndDownloadWorkbook(sortedOutput) {
  //* create workbook and worksheet
  const wb = new Excel.Workbook();
  const ws = wb.addWorksheet('Weighted Word Frequency');


  //* add data to worksheet
  sortedOutput.forEach((line, index) => {
    const row = line.split('\t');
    //* delete last cell of every row
    row.pop();
    if (index === 0) {
      //* add column headers
      row.push('CTR');
      row.push('7 Day ACoS');
      row.push('CPC');
      row.push('7 Day CVR');
    } else if (index + 1 !== sortedOutput.length) {
      //* add formulas to last four columns
      row.push({ formula: `=IFERROR(C${index + 1}/B${index + 1},"NA")` });
      row.push({ formula: `=IFERROR(D${index + 1}/E${index + 1},9)` });
      row.push({ formula: `=IFERROR(D${index + 1}/C${index + 1},"NA")` });
      row.push({ formula: `=IFERROR(F${index + 1}/C${index + 1},0)` });
    }
    ws.addRow(row);
  });

  //* format data
  ws._rows.forEach((row, i) => {
    row._cells.forEach((cell, j) => {
      if (i === 0 || j === 0) { //* if first crow or first column
        cell.numFmt = '@';
      } else if (j === row._cells.length - 2) { //* if cell is second to the last column (CPC)
        cell.numFmt = '0.00;(-[Red]0.00)';
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4bACC6' } };
      } else if (j >= row._cells.length - 4) { //* if cell is one of last for columns
        cell.numFmt = '0.00%;(-[Red]0.00%)';
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4bACC6' } };
      } else { //* if cell value has decimal
        cell.value = parseFloat(cell.value.toString());
        if (cell.value % 1 !== 0) {
          cell.numFmt = '0.00;(-[Red]0.00)';
        }
      }
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
  row.eachCell((cell, index) => {
    //* auto filter
    cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    cell.font = {
      size: 10,
      bold: true,
    };
    //* bottom border
    cell.border = {
      bottom: { style: 'thin' },
    };
    //* background
    if (index > ws.getRow(1)._cells.length - 4) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4bACC6' },
      };
    } else {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFBFBFBF' },
      };
    }
  });

  //* freeze top row
  ws.views = [
    {
      state: 'frozen', ySplit: 1,
    },
  ];

  //* resize column widths
  ws.columns.forEach((column, index) => {
    if (index === 0) { column.width = 20; } else column.width = 15;
  });

  //* download
  wb.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, generateFileName());
  });

  console.log('Done!');
}

function onCalculateClick() {
  let rawData = document.getElementById('taData').value;
  const repForbiddenWith = document.getElementById('tbRf').value === '' ? ' ' : document.getElementById('tbRf').value;
  rawData = rawData.split('$').join(`${repForbiddenWith}`);
  rawData = rawData.split('^').join(`${repForbiddenWith}`);
  rawData = rawData.split('*').join(`${repForbiddenWith}`);
  rawData = rawData.split('+').join(`${repForbiddenWith}`);
  rawData = rawData.split('.').join(`${repForbiddenWith}`);
  rawData = rawData.split('?').join(`${repForbiddenWith}`);
  rawData = rawData.split('/').join(`${repForbiddenWith}`);
  rawData = rawData.split('\\').join(`${repForbiddenWith}`);

  const dataSplitLine = rawData.split('\n');
  const header = dataSplitLine[0].split('\t');
  const rawDataArray = [];
  const words = [];
  let rawOutput = '';
  let sortedOutput = '';


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

  //* sort search terms
  words.sort();

  //* headers
  header.forEach((element) => {
    const data = element.trim();
    rawOutput += `${data}\t`;
  });
  rawOutput += '\n';

  //* calculations
  words.forEach((word) => { //* for each word in words list
    rawOutput += `${word}\t`; //* add word\t to output
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
      rawOutput += `${sum}\t`; //* add sum to output
    }
    rawOutput += '\n'; //* add \n to output
  });

  //* sort by sum of clicks
  sortedOutput = rawOutput.split('\n');
  for (let i = 1; i < sortedOutput.length; i += 1) {
    for (let j = i + 1; j < sortedOutput.length; j += 1) {
      if (parseFloat(sortedOutput[j].split('\t')[2]) > parseFloat(sortedOutput[i].split('\t')[2])) {
        const temp = sortedOutput[i];
        sortedOutput[i] = sortedOutput[j];
        sortedOutput[j] = temp;
      }
    }
  }

  //* download output
  generateAndDownloadWorkbook(sortedOutput);
}

class BtnCalculate extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <React.Fragment>
        <button type="submit" id="btnCalculate" onClick={onCalculateClick}>
          Calculate
        </button>
      </React.Fragment>
    );
  }
}

export default BtnCalculate;
