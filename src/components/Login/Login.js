import React, { useContext, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";

const loginReducer = (state, action) => {
  /* Email (value update & validate) */
  if (action.id === "EMAIL") {
    if (action.type === "VALUE_UPDATE") {
      return {
        ...state,
        emailValue: action.value,
        isEmailValid: action.value.includes("@"),
      };
    }
    if (action.type === "VALIDATE") {
      return {
        ...state,
        emailValue: state.emailValue,
        isEmailValid: state.emailValue.includes("@"),
      };
    }
  }

  /* Password (value update & validate) */
  if (action.id === "PASSWORD") {
    if (action.type === "VALUE_UPDATE") {
      return {
        ...state,
        passwordValue: action.value,
        isPasswordValid: action.value.trim().length > 6,
      };
    }
    if (action.type === "VALIDATE") {
      return {
        ...state,
        passwordValue: state.passwordValue,
        isPasswordValid: state.passwordValue.trim().length > 6,
      };
    }
  }

  /* Login (validate) */
  if (action.id === "LOGIN") {
    return {
      ...state,
      isLoginValid: state.isEmailValid && state.isPasswordValid,
    };
  }

  return {
    emailValue: "",
    isEmailValid: false,
    passwordValue: "",
    isPasswordValid: false,
    isLoginValid: false,
  };
};

const Login = (props) => {
  /* 7.- useReducer hook */
  const [loginState, dispatchLogin] = useReducer(loginReducer, {
    emailValue: "",
    isEmailValid: false,
    passwordValue: "",
    isPasswordValid: false,
    isLoginValid: false,
  });

  /* Destructuring state object properties for a correct useEffect management */
  const { isEmailValid } = loginState;
  const { isPasswordValid } = loginState;

  /* 6.- Side effect dependencies */
  useEffect(() => {
    /* 6.- Set time out */
    const timeOutId = setTimeout(() => {
      /* Validate Login */
      dispatchLogin({ id: "LOGIN" });
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [isEmailValid, isPasswordValid]);

  const emailChangeHandler = (event) => {
    /* Update email value */
    dispatchLogin({
      id: "EMAIL",
      type: "VALUE_UPDATE",
      value: event.target.value,
    });
  };

  const passwordChangeHandler = (event) => {
    /* Update password value */
    dispatchLogin({
      id: "PASSWORD",
      type: "VALUE_UPDATE",
      value: event.target.value,
    });
  };

  const validateEmailHandler = () => {
    /* Validate email */
    dispatchLogin({
      id: "EMAIL",
      type: "VALIDATE",
    });
  };

  const validatePasswordHandler = () => {
    /* Validate password */
    dispatchLogin({
      id: "PASSWORD",
      type: "VALIDATE",
    });
  };

  const authContext = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    authContext.onLogin(loginState.emailValue, loginState.passwordValue);
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
            value={loginState.emailValue}
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
            value={loginState.passwordValue}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button
            type='submit'
            className={classes.btn}
            disabled={!loginState.isLoginValid}
          >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
