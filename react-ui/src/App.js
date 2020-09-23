import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Link } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Landing from './pages/landing';
import Create_Account from './pages/create-account';
import Event_Details from './pages/event-details';
import My_Events from './pages/my-events';
import Design from './pages/design';
import Registrations from './pages/registrations';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Route exact path="/" component={Landing} />
        <Route exact path="/Dashboard" component={Dashboard} />
        <Route exact path="/Create_Account" component={Create_Account} />
        <Route exact path="/Event_Details" component={Event_Details} />
        <Route exact path="/My_Events" component={My_Events} />
        <Route exact path="/Design" component={Design} />
        <Route exact path="/Registrations" component={Registrations} />
      </header>
    </div>
  );
}

export default App;
