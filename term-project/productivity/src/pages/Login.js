import React from 'react'
import Header from '../components/Header'
import LoginBox from '../components/LoginBox'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div>
        <Header title="Login" desc="Login to your dashboard to use productivity" />
        <div className="navbar">
        <Link to='/'>Back</Link>
        <Link to="/register">Register</Link>
        </div>
        <LoginBox />
    </div>
  )
}
