import React, { useState, useEffect } from 'react'
import HabitTracker from '../components/HabitTracker'
import ToDo from '../components/ToDo'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, resetUserSession } from '../service/AuthService';

export default function Dashboard() {

  const navigate = useNavigate();






  const [user, setUser] = useState(getUser());

  console.log(user);

  const [score, setScore] = useState(user.score);

  useEffect(() => {
    const userFromLocalStorage = getUser();
    setUser(userFromLocalStorage);
    setScore(userFromLocalStorage.score);
  }, []);

  const logoutHandler = () => {
    resetUserSession();
    navigate('/login');
  }


  return (
    <div>
      <div className="dashboard-header">
        <span>{user.fname} {user.lname}</span>
        <span className="score">Score: {score}</span>
      </div>
      <div className="navbar">
        <Link to='/login' onClick={logoutHandler}>Logout</Link>

        <Link to="/info">Info</Link>
      </div>

      <div className="dashboard-body">
        <div className="row1">
          <div className="habit-tracker">
            <HabitTracker user={user} score={score} setScore={setScore} />
          </div>

        </div>
        {/* <div className="row2">
           <div className="to-do">
              <ToDo setScore={setScore} />
           </div>
        </div> */}
      </div>

    </div>
  )
}
