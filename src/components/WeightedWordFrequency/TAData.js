import React, { Component } from 'react';
import './TAData.css';

const initialState = {};

class TAData extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <React.Fragment>
        <textarea id="tadata" />
      </React.Fragment>
    );
  }
}

export default TAData;
