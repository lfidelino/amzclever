import React, { Component } from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import Login from './components/Login/Login';
import WeightedWordFrequency from './components/WeightedWordFrequency/WeightedWordFrequency';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    document.getElementById('inputPassword').focus();
    const diff = (new Date(Date.now())).getTime() - (new Date(localStorage.getItem('timedIn'))).getTime();
    if (diff <= 3600000) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
      localStorage.removeItem('timedIn');
    }
  }

  onLogin = (password) => {
    if (password === 'Password8') {
      localStorage.setItem('timedIn', new Date(Date.now()));
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
  }

  onLogout = () => {
    this.setState({ loggedIn: false });
    localStorage.removeItem('timedIn');
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <BrowserRouter>
        <>
          <Switch>
            {loggedIn ? (
              <Route
                exact
                path="/"
                render={() => <WeightedWordFrequency onLogout={this.onLogout} />}
              />
            ) : (
              <Route
                exact
                path="/"
                render={() => <Login onLogin={this.onLogin} />}
              />
            )}
          </Switch>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
