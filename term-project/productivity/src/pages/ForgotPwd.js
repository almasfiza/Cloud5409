import React from 'react'
import Header from '../components/Header'
import PwdBox from '../components/PwdBox'

export default function ForgotPwd() {
  return (
    <div>
        <Header title="Forgot Password" desc="Enter your email to reset the password" />
        <PwdBox />
    </div>
  )
}
