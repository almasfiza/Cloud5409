import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { setUserSession } from "../service/AuthService";
import axios from 'axios';

// const LOGIN_URL = process.env.REGLOGIN_ENDPOINT;
const REGLOGIN_URL = "https://reglogin.execute-api.us-east-1.amazonaws.com";
const loginUrl = `${REGLOGIN_URL}/login`;

export default function LoginBox() {
  const navigate = useNavigate(); // Access the navigate function from useNavigate
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    usermail: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform login functionality
    if (formData.usermail.trim() === '' || formData.password.trim() === '') {
      setMessage("Enter both usermail and the password.");
      return;
    }
    setMessage(null);

    // const requestConfig = {
    //   headers: {
    //     'x-api-key': 'SSseP4bB4G23mPisEfylXww0Su8WNGlxWGRK5sd0'
    //   }
    // };

    const requestBody = {
      usermail: formData.usermail,
      password: formData.password
    };

    axios.post(loginUrl, requestBody)
      .then((response) => {
        setUserSession(response.data.user, response.data.token);
        navigate('/dashboard'); // Use the navigate function to navigate to the dashboard
      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Backend server is down. Try again.");
        }
      });
  };

  return (
    <div className="box-login">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              name="usermail"
              value={formData.usermail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="forgotPwdLink">
            <Link to="/forgotPwd">Forgot Password? Click here</Link>
          </div> */}

          <div className="button-container">
            <input type="submit" value="Login" />
          </div>
        </form>
        {message && <p className="reg-message">{message}</p>}
      </div>
    </div>
  );
}
