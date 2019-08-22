import React, { Component } from 'react';

const initialState = {};

class TBReplaceForbidden extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    return (
      <>
        Replace forbidden characters (& $ ^ * + ? / \) with:
        {' '}
        <input type="text" name="tbRf" id="tbRf" size="2" value="@" />
      </>
    );
  }
}

export default TBReplaceForbidden;
