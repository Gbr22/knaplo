import React from 'react';

import LoginScreen from './screens/login/Login';

import InstItem from './data/types';


class App extends React.Component {
  constructor(props: Object){
    super(props);

  }

  render(){
    return (
      <div className="App">
        <LoginScreen />
      </div>
    );
  }
}


export default App;
