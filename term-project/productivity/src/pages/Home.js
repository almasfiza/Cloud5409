import React from 'react'
import { Link } from 'react-router-dom';
import backgroundImage from '..//assets/productivity-bg.png';

export default function Home() {
  return (
    <div className="home" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay">
        <h1 className="homepage-title">Productivity</h1>
        <p className="homepage-desc">A habit tracker for better productivity.</p>
        <div className="buttons-container">
        <Link to="/login" className="sign-in-btn">Sign In</Link>
          <Link to="/register" className="register-btn">Register</Link>
        </div>
      </div>
    </div>
  )
}
