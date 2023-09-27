import React from 'react'
import Header from "../components/Header"
import RegistrationBox from '../components/RegistrationBox'
import { Link } from 'react-router-dom'

export default function Registration() {
  return (
    <div>
        <Header title="Join us now!"
        desc="Start using productivity for a better you, today!" />
        <div className="navbar">
        <Link to='/'>Back</Link>
        <Link to="/login">Log in</Link>
        </div>
        <RegistrationBox />
    </div>
  )
}
