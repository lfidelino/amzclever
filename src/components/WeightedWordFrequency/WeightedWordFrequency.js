/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import TAData from './TAData';
import TBReplaceForbidden from './TBReplaceForbidden';
import BtnCalculate from './BtnCalculate';
import './WeightedWordFrequency.css';

const initialState = {};

class WeightedWordFrequency extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    const { onLogout } = this.props;
    return (
      <>
        <div id="divWwf">
          <h2>Weighted Word Frequency</h2>
          <TAData />
          <TBReplaceForbidden />
          <br />
          <br />
          <BtnCalculate />

          <button type="submit" id="btnLogout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </>
    );
  }
}
export default WeightedWordFrequency;
