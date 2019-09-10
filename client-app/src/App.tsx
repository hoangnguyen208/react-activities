import React, { Component } from 'react';
import './App.css';
import { Header } from 'semantic-ui-react';

class App extends Component {
  render () {
    return (
      <div className="App">
        <Header as='h2' icon='plug' content='Uptime Guarantee' />
      </div>
    );
  }
}

export default App;
