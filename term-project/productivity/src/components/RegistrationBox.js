import React, { useState } from 'react';
import axios from 'axios';

// const REG_URL = process.env.REGLOGIN_ENDPOINT;
const REGLOGIN_URL = "https://reglogin.execute-api.us-east-1.amazonaws.com";
const registerUrl = `${REGLOGIN_URL}/register`;

const RegistrationBox = () => {

  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    usermail: '',
    password: '',
    confirmpassword: ''
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.fname.trim() === '' || formData.lname.trim() === '' || formData.usermail.trim() === '' || formData.password.trim() === '' || formData.confirmpassword.trim() === '') {
      setMessage("All the fields are required.");
      return;
    }
  
    if (formData.password !== formData.confirmpassword) {
      setMessage("Confirm password does not match the Password.");
      return;
    }
  
    setMessage(null);
    const requestBody = {
      fname: formData.fname,
      lname: formData.lname,
      usermail: formData.usermail,
      password: formData.password,
      confirmpassword: formData.confirmpassword
    };
    
  
    try {
      // const requestConfig = {
      //   headers: {
      //     'x-api-key': 'SSseP4bB4G23mPisEfylXww0Su8WNGlxWGRK5sd0'
      //   }
      // };
  
      const response = await axios.post(registerUrl, requestBody, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        }
      });
      console.log(response);
      
      if (response.data && response.status === 200) {
        
        setMessage('Registration Successful. Please subscribe to the email sent to you for notifications.');
      } else {
        setMessage("Unexpected response from the server. Please try again later.");
      }
    } catch (error) {
      if (error.response && error.response.status) {
        if (error.response.status === 401 || error.response.status === 403) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Backend server is down. Please try again later.");
        }
      } else if (error.request) {
        setMessage("No response received from the server. Please try again later.");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    }
  };
  

  return (
    <div className="box-registration">
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>First Name</label>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Last Name</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            required
          />
        </div>
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
        <div className="input-container">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmpassword"
            value={formData.confirmpassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-container">
          <input type="submit" value="Register" />
        </div>
      </form>
      {message && <p className="reg-message">{message}</p>}
    </div>
    </div>
  );
};

export default RegistrationBox;
