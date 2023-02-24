import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (state, action) => {
  if (action.id === "USER_INPUT") {
    return { value: action.value, isValid: action.value.includes("@") };
  }
  if (action.id === "LOST_FOCUS") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.id === "USER_INPUT") {
    return { value: action.value, isValid: action.value.trim().length > 6 };
  }
  if (action.id === "LOST_FOCUS") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  /* 7.- useReducer hook */
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });

  const [formIsValid, setFormIsValid] = useState(false);

  /* Alias for object destructuring */
  const { isValid: isEmailValid } =  emailState;
  const { isValid: isPasswordValid } =  passwordState;

  /* 6.- Side effect dependencies */
  useEffect(() => {
    /* 6.- Set time out */
    const timeOutId = setTimeout(() => {
      setFormIsValid(isEmailValid && isPasswordValid);
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [isEmailValid, isPasswordValid]);



  const emailChangeHandler = (event) => {
    /* value handler */
    dispatchEmail({ id: "USER_INPUT", value: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    /* value handler */
    dispatchPassword({ id: "USER_INPUT", value: event.target.value });
  };

  const validateEmailHandler = () => {
    /* valid handler */
    dispatchEmail({ id: "LOST_FOCUS" });
  };

  const validatePasswordHandler = () => {
    /* valid handler */
    dispatchPassword({ id: "LOST_FOCUS" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            isEmailValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor='email'>E-Mail</label>
          <input
            type='email'
            id='email'
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            isPasswordValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
