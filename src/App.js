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
  }

  componentDidMount() {
    console.log(new Date(Date.now()));
    console.log(localStorage.getItem('timedIn'));
    const diff = (new Date(Date.now())).getTime() - (new Date(localStorage.getItem('timedIn'))).getTime();
    console.log(diff);
    if (diff <= 3600000) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
      localStorage.removeItem('timedIn');
    }
  }

  onLogin = async (password) => {
    if (password === 'Password8') {
      localStorage.setItem('timedIn', new Date(Date.now()));
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <BrowserRouter>
        <>
          <Switch>
            {loggedIn ? (
              <Route exact path="/" render={() => <WeightedWordFrequency />} />
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
