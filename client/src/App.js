import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./react-routes/Home";
import Dashboard from "./react-routes/Dashboard";
import SignIn from "./react-routes/SignIn";
import "./App.css";
import { Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/signIn" component={SignIn} />
        </Switch>
      </div>
    );
  }
}

export default App;
