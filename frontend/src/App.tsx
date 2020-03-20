import React from 'react';

import LoginScreen from './screens/login/Login';

import InstItem from './data/types';
import { currentUser } from './data/DataHandler';


class App extends React.Component {
  constructor(props: Object){
    super(props);

  }

  render(){
    return (
      <div className="App">
        {!currentUser.loggedIn ? (
          <LoginScreen />
        ) : ""}
      </div>
    );
  }
}


export default App;
