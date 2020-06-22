import React, { Component } from "react";
import SignUpComponent from "../components/SignUpComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/routeCss/home.css";
import { withRouter } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <div className="homeDiv">
          <SignUpComponent />
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
