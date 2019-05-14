import React, { Component } from 'react';
import TAData from './TAData';
import BtnCalculate from './BtnCalculate';

const initialState = {};

class WeightedWordFrequency extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <React.Fragment>
        <h2>Weighted Word Frequency</h2>
        <TAData />
        <BtnCalculate />
      </React.Fragment>
    );
  }
}
export default WeightedWordFrequency;
