import React, { useState } from "react";

export default function PwdBox() {

    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (event) => {
    event.preventDefault();
    const { email } = event.target.elements;
    setEmail(email.value);
    setIsSubmitted(true);
    console.log(email.value)
  };
   
    // JSX code for login form
    const renderForm = (
       
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Email </label>
              <input type="email" name="email" required />
             
            </div>
            <div className="button-container">
              <input type="submit" />
            </div>
          </form>
       
      );
      
  
    return (
        
        <div className="box-login">
          {isSubmitted ? <div>Notification sent to email address.</div> : renderForm}
        </div>
       
    );
  }
  