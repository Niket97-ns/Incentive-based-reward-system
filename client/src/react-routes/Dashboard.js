import React, { Component } from "react";
// import SignUpComponent from "../components/SignUpComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/routeCss/dashboard.css";
import { Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";

const tokenConfig = (token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
};

async function checkUser(token) {
  // function returns user if any
  return await axios.get("/users", tokenConfig(token));
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    let isLoggedIn = true;
    let logged_in_user = "";

    this.state = {
      isLoggedIn,
      logged_in_user,
    };
  }

  onClick = () => {
    localStorage.removeItem("token");
    this.props.history.push("/");
  };

  async componentDidMount() {
    var logged_in_user = "";
    // Fetch token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({
        isLoggedIn: false,
      });
      this.props.history.push("/");
    } else {
      await checkUser(token)
        .then((data) => {
          logged_in_user = data.data.user;
          this.setState({
            logged_in_user: logged_in_user,
          });
        })
        .catch((err) => {
          alert("Your session has expired");
          localStorage.removeItem("token");
          this.props.history.push("/");
        });
    }
  }

  render() {
    return (
      <div>
        <div className="dashboardDiv"></div>
        <h2>Welcome {this.state.logged_in_user.name} are logged In</h2>
        <Button onClick={this.onClick}>Logout</Button>
      </div>
    );
  }
}

export default withRouter(Dashboard);
