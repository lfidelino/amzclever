/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import './Login.css';

const initialState = {};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    document.getElementById('inputPassword').addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        document.getElementById('btnLogin').click();
      }
    });
  }

  onPasswordSubmit = () => {
    const { onLogin } = this.props;
    onLogin(document.getElementById('inputPassword').value);
  }

  render() {
    return (
      <>
        <div id="login">
          <input
            type="password"
            name="password"
            id="inputPassword"
            placeholder="Password..."
          />

          <button type="submit" id="btnLogin" onClick={this.onPasswordSubmit}>
            Login
          </button>
        </div>
      </>
    );
  }
}


export default Login;
