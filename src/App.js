import React, { Component } from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import Login from './components/Login/Login';
import WeightedWordFrequency from './components/WeightedWordFrequency/WeightedWordFrequency';
import './App.css';

const initialState = {
  loggedIn: false,
};
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    localStorage.setItem('loggedIn', true);
  }

  render() {
    return (
      <BrowserRouter>
        <>
          <Switch>
            {localStorage.getItem('loggedIn') ? (
              <Route exact path="/" render={() => <WeightedWordFrequency />} />
            ) : (
              <Route exact path="/" render={() => <Login />} />
            )}
          </Switch>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
