import React, { Component } from 'react';

const initialState = {};

class Login extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <>
        <input type="text" name="password" id="password-input-text" placeholder="Password..." />

        <button type="submit" id="btnLogin">
          Login
        </button>
      </>
    );
  }
}


export default Login;
