import React, { Component } from 'react';

const initialState = {};

class TAData extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <React.Fragment>
        <textarea id="taData" />
      </React.Fragment>
    );
  }
}

export default TAData;
