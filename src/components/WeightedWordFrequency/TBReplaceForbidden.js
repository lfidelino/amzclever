import React, { Component } from 'react';
import './TBReplaceForbidden.css';

const initialState = {};

class TBReplaceForbidden extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    return (
      <>
        Replace forbidden characters ( &#123; &#125; [ ] ( ) & $ ^ * + ? / \
        ) with:

        <input type="text" name="tbRf" id="tbRf" size="2" defaultValue="@" />
      </>
    );
  }
}

export default TBReplaceForbidden;
