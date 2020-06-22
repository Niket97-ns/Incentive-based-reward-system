import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/routeCss/signIn.css";
import SignInComponent from "../components/SignInComponent";
import { withRouter } from "react-router-dom";

class SignIn extends Component {
  render() {
    return (
      <div>
        <div className="signInDiv">
          <SignInComponent />
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);
