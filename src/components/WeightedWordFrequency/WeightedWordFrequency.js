import React, { Component } from 'react';
import TAData from './TAData';
import TBReplaceForbidden from './TBReplaceForbidden';
import BtnCalculate from './BtnCalculate';
import './WeightedWordFrequency.css';

const initialState = {};

class WeightedWordFrequency extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <React.Fragment>
        <div id="divWwf">
          <h2>Weighted Word Frequency</h2>
          <TAData />
          <TBReplaceForbidden />
          <br />
          <br />
          <BtnCalculate />
        </div>
      </React.Fragment>
    );
  }
}
export default WeightedWordFrequency;
