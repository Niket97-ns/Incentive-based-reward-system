import React, { Component } from "react";
import { Card, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import "../css/componentCss/signIn.css";
import axios from "axios";
import { withRouter } from "react-router-dom";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = async (state) => {
  var valid = true;
  if (state.email === null || state.password === null) {
    valid = false;
    alert("Form Incomplete");
    return valid;
  }

  Object.values(state.errors).forEach(
    // if we have an error string set valid to false
    (val) => val.length > 0 && (valid = false)
  );

  return valid;
};

class SignInComponent extends Component {
  state = {
    email: null,
    password: null,

    errors: {
      email: "",
      password: "",
    },
  };

  onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password =
          value.length < 8 ? "Password must be 8 characters long!" : "";
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  async onSubmit(event) {
    event.preventDefault();
    if (await validateForm(this.state)) {
      //check if form is valid

      // postRequest= request to authenticate to the DB
      async function postRequest(state) {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const body = JSON.stringify({
          email: state.email,
          password: state.password,
        });

        return await axios.post("/signIn", body, config);
      }

      await postRequest(this.state)
        .then((response) => {
          const token = response.data.token;
          console.log("signIn token = " + token);
          localStorage.setItem("token", token);
          this.props.history.push("/dashboard");
        })
        .catch((err) => {
          alert(err.response.data.msg);
        });
    } else {
      console.error("Invalid Form");
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div>
        <Card className="signInCard">
          <h3 className="d-flex justify-content-center"> Sign Up</h3>
          <Form>
            <FormGroup>
              <Label for="email" className="emailLabel">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email"
                onChange={this.onChange}
                style={{ width: "90%", marginLeft: "1rem" }}
                required
              />
              {errors.email.length > 0 && (
                <span className="error">{errors.email}</span>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="password" className="passwordLabel">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter a Password"
                onChange={this.onChange}
                style={{ width: "90%", marginLeft: "1rem" }}
                required
              />
              {errors.password.length > 0 && (
                <span className="error">{errors.password}</span>
              )}
            </FormGroup>
            <div className="signInButtonDiv">
              <Button
                color="dark"
                size="sm"
                className="signInButton"
                onClick={this.onSubmit.bind(this)}
              >
                Sign In
              </Button>
            </div>
            <div>
              <h6 className="d-flex justify-content-center">
                <pre>
                  Not an user? <a href="/">Create an account</a>
                </pre>
              </h6>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

export default withRouter(SignInComponent);
