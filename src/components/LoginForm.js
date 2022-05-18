import React, { useState, useContext } from "react";
import "./LoginForm.css";
import { Button } from "@mui/material";
import { Input, InputLabel } from "@mui/material";
import { GlobalStateContext } from "../reducer/GlobalState";

function LoginForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [state, dispatch] = useContext(GlobalStateContext);

  const getUser = (name, pwd) => {
    let users = [...state.users];
    let curr_user = -1;

    for (let i = 0; i < users.length; i++) {
      if (users[i].user_name === name && users[i].password === password) {
        curr_user = i;
        break;
      }
    }

    return curr_user;
  };

  const register = () => {
    if (name.length === 0) alert("Please enter proper Username");
    else if (password.length === 0) alert("Please enter valid Password");
    else {
      let curr_user = getUser(name, password);

      if (curr_user === -1) {
        dispatch({
          type: "ADD_USER",
          user_name: name,
          password: password,
        });

        dispatch({
          type: "UPDATE_MODAL_MESSAGE",
          msg1: "Successfully Registered!!!",
          msg2: "Please Login to Continue",
        });
      } else {
        dispatch({
          type: "UPDATE_MODAL_MESSAGE",
          msg1: "User Already Exist!!!",
          msg2: "Please Login to Continue",
        });
      }

      dispatch({
        type: "SHOW_MODAL",
        show_modal: !state.show_modal,
      });

      setName("");
      setPassword("");
    }
  };

  const login = () => {
    if (name.length === 0) alert("Please enter proper Username");
    else if (password.length === 0) alert("Please enter valid Password");
    else {
      let curr_user = getUser(name, password);

      if (curr_user === -1) {
        dispatch({
          type: "UPDATE_MODAL_MESSAGE",
          msg1: "Invalid Credentials!!!",
          msg2: "We could not find your login credentials in database. Please do Register before login",
        });

        dispatch({
          type: "SHOW_MODAL",
          show_modal: !state.show_modal,
        });

        setName("");
        setPassword("");
      } else {
        dispatch({
          type: "UPDATE_USER",
          curr_user: curr_user,
        });

        dispatch({
          type: "UPDATE_MODAL_MESSAGE",
          msg1: "Login Success!!!",
          msg2: "Now you can upload the data to your database",
        });

        dispatch({
          type: "SHOW_MODAL",
          show_modal: !state.show_modal,
        });

        setTimeout(() => {
          dispatch({
            type: "SHOW_MODAL",
            show_modal: false,
          });
        }, 3000);
      }
    }
  };

  return (
    <div className="login_form">
      <div className="login_details">
        <InputLabel sx={{ fontSize: "1.2rem", color: "rgb(73, 73, 73)" }}>
          Username :{" "}
        </InputLabel>
        <Input
          type="string"
          value={name}
          className="input"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </div>

      <div className="login_details">
        <InputLabel sx={{ fontSize: "1.2rem", color: "rgb(73, 73, 73)" }}>
          Password :{" "}
        </InputLabel>
        <Input
          type="password"
          value={password}
          className="input"
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
      </div>

      <div className="buttons">
        <Button
          className="login-btn"
          color="primary"
          variant="contained"
          onClick={register}
          size="large"
        >
          Register
        </Button>
        <Button
          className="login-btn"
          color="success"
          variant="contained"
          onClick={login}
          size="large"
        >
          Login
        </Button>
      </div>
    </div>
  );
}

export default LoginForm;
