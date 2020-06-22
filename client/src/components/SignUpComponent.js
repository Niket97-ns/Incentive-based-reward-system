import React, { Component } from "react";
import { Card, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import "../css/componentCss/signUp.css";
import axios from "axios";
import { withRouter } from "react-router-dom";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateReferralCode = async (state) => {
  var decision = true;
  if (state.referralCode !== null && state.email) {
    async function postRequest() {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const body = JSON.stringify({
        email: state.email,
        referralCode: state.referralCode,
      });
      return await axios.post("/referralCode", body, config);
    }
    try {
      const response = await postRequest();
      decision = true;
    } catch (error) {
      decision = false;
    }
  }
  return decision;
};

const validateForm = async (state) => {
  var valid = true;
  if (
    state.email === null ||
    state.fullname === null ||
    state.password === null ||
    state.mobileNumber === null
  ) {
    valid = false;
    alert("Form Incomplete");
    return valid;
  }
  var validReferralCode = await validateReferralCode(state);

  if (validReferralCode) {
    Object.values(state.errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
  } else {
    valid = false;
  }
  return valid;
};

class SignUpComponent extends Component {
  state = {
    fullname: null,
    email: null,
    password: null,
    mobileNumber: null,
    level: "manager",
    referralCode: null,
    errors: {
      fullname: "",
      email: "",
      password: "",
      mobileNumber: "",
      level: "",
      referralCode: "",
    },
  };

  onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "fullname":
        errors.fullname =
          value.length < 5 ? "Full Name must be 5 characters long!" : "";
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password =
          value.length < 8 ? "Password must be 8 characters long!" : "";
        break;
      case "mobileNumber":
        errors.mobileNumber =
          value.length == 8 || value.length == 10
            ? ""
            : "Mobile number must be 8 or 10 digits";
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

      // postRequest= request to register new user to the DB
      async function postRequest(state) {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const body = JSON.stringify({
          name: state.fullname,
          email: state.email,
          password: state.password,
          mobile_number: state.mobileNumber,
          level_of_user: state.level,
          referralCode: state.referralCode,
        });

        return await axios.post("/users", body, config);
      }
      try {
        const user_response = await postRequest(this.state);
        let token;
        if (this.state.referralCode) {
          // tRequest = save transaction if user is referred
          async function tRequest(state) {
            const config = {
              headers: {
                "Content-type": "application/json",
              },
            };
            const body = {
              email: state.email,
              level_of_user: state.level,
            };

            return await axios.post("/referralTransactions", body, config);
          }
          try {
            const t_respone = await tRequest(this.state);
            console.log("transaction done");
          } catch (err) {
            console.log(err);
          }
        }

        token = user_response["data"]["token"];
        localStorage.setItem("token", token);
        console.log("my token =" + localStorage.getItem("token"));
        if (localStorage.getItem("token")) {
          this.props.history.push("/dashboard");
        }
      } catch (error) {
        console.log("We have come accross an error");
      }
    } else {
      console.error("Invalid Form");
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div>
        <Card className="signUpCard">
          <h3 className="d-flex justify-content-center"> Sign Up</h3>
          <Form>
            <FormGroup>
              <Label for="fullname" className="fullnameLabel">
                Full Name
              </Label>
              <Input
                type="text"
                name="fullname"
                id="fullname"
                placeholder="Enter your Full Name"
                onChange={this.onChange}
                style={{ width: "90%", marginLeft: "1rem" }}
              />
              {errors.fullname.length > 0 && (
                <span className="error">{errors.fullname}</span>
              )}
            </FormGroup>
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
            <FormGroup>
              <Label for="mobileNumber" className="mobileNumberLabel">
                Mobile Number
              </Label>
              <Input
                type="tel"
                name="mobileNumber"
                id="mobileNumber"
                // className="mb-3"
                placeholder="Enter your Mobile Number"
                onChange={this.onChange}
                style={{ width: "80%", marginLeft: "1rem" }}
                required
              />
              {errors.mobileNumber.length > 0 && (
                <span className="error">{errors.mobileNumber}</span>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="level" className="levelLabel">
                Choose a Level:
              </Label>
              <select id="level" name="level" onChange={this.onChange}>
                <option value="manager" selected>
                  Manager
                </option>
                <option value="executive">Executive</option>
                <option value="boardMember">Board Member</option>
                <option value="others">Others</option>
              </select>
            </FormGroup>

            <FormGroup>
              <Label for="referralCode" className="referralCodeLabel">
                Referral Code
              </Label>
              <Input
                type="text"
                name="referralCode"
                id="referralCode"
                placeholder="Enter a Referral Code(If you have one)"
                onChange={this.onChange}
                style={{ width: "90%", marginLeft: "1rem" }}
                required
              />
              {errors.referralCode.length > 0 && (
                <span className="error">{errors.referralCode}</span>
              )}
            </FormGroup>

            <div className="signUpButtonDiv">
              <Button
                color="dark"
                size="sm"
                className="signUpButton"
                onClick={this.onSubmit.bind(this)}
              >
                Sign Up
              </Button>
            </div>
            <div>
              <h6 className="d-flex justify-content-center">
                <pre>
                  Already have an account? <a href="/signIn">Sign In</a>
                </pre>
              </h6>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

export default withRouter(SignUpComponent);
