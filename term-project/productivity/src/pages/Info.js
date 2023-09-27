import React from 'react'
import Header from '../components/Header'
import { Link } from 'react-router-dom'

export default function Info() {
  return (
    <div>
        <Header title="Info" desc="Understand how the habit tracker point system works." />
        <div className="navbar">
        
            <Link to="/dashboard">Back</Link>
         </div>
      
        <h1>Habit Tracker</h1>
        <p className="desc-p">Click on <b>Add Habit</b> to add a new habit to your dashboard. You can see all the habits on your dashboard. Each habit has 21 days streak to maintain.</p>
       
      <p className="desc-p">You get a 10 point for checking out each day. If you miss a day or two in between, you will have a penalty of 50 points. On completing 21 days, you will get 1000 points on your score. We understand it might be hard to build habits. But keep hanging on. Even if you miss a day, keep continuing.</p>
      <p className="desc-p">
        <ul style={{ listStyle: 'none' }}>
            <li>+10 points for compeleting a day consecutively.</li>
            <li>-50 points if you miss a day.</li>
            <li>1000 points for completing the 21 days.</li>
        </ul>
      </p>
    </div>
  )
}
