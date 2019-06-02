import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import WeightedWordFrequency from './components/WeightedWordFrequency/WeightedWordFrequency';
import './App.css';

const initialState = {};
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Switch>
            <Route exact path="/" component={WeightedWordFrequency} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
