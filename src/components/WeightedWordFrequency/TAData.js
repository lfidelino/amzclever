import React, { Component } from 'react';

const initialState = {};

class TAData extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <>
        <textarea id="taData" />
      </>
    );
  }
}

export default TAData;
