import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

// const HABIT_URL = process.env.HABIT_ENDPOINT;
// const SCORE_URL = process.env.SCORE_ENDPOINT;
const HABIT_URL = "https://habit.execute-api.us-east-1.amazonaws.com";
const SCORE_URL = "https://score.execute-api.us-east-1.amazonaws.com";

const gethabitUrl =  `${HABIT_URL}/gethabit`;
const addUrl = `${HABIT_URL}/addhabit`;
const completeUrl = `${HABIT_URL}/complete`;
const deletehabitUrl = `${HABIT_URL}/deletehabit`;

const updatescoreUrl = `${SCORE_URL}/updatescore`;





const HabitTracker = ({ user, score, setScore }) => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [habits, setHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState([]);

  const updateScoreInBackend = async (newScore) => {
    const requestBody = {
      usermail: user.usermail,
      score: newScore,
    };
  
    try {
      const response = await axios.post(updatescoreUrl, requestBody, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        }
      });
  
      // Handle the response if needed
      console.log('Score updated in backend:', response.data);
  
      // You can perform any further actions here if required
  
    } catch (error) {
      // Handle the error if needed
      console.log('Error updating score in backend:', error);
    }
  };
  







  const completeHabit = async (usermail, habit) => {
    try {
      const requestBody = {
        usermail: usermail,
        habit: habit
      };
  
      // const requestConfig = {
      //   headers: {
      //     'x-api-key': 'nJz4ShTPac1maB1X1S9biaOik9Qvl7yr3yXKeaxV' // If your API requires an API key, add it here
      //   }
      // };
  
      const response = await axios.post(completeUrl, requestBody, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        }

      });
      console.log('Habit days incremented successfully:', response.data);
      return response.data.days; // Return the updated days from the response
    } catch (error) {
      console.error('Failed to increment habit days:', error);
      throw error; // Propagate the error to the caller
    }
  }
  //getting the user

  console.log("User under habit tracker: ", user.usermail);

  //getting the habits

  useEffect(() => {
    // const requestConfig = {
    //   headers: {
    //     'x-api-key': 'nJz4ShTPac1maB1X1S9biaOik9Qvl7yr3yXKeaxV'
    //   }
    // };

    const requestBody = {
      usermail: user.usermail,
    };

    axios.post(gethabitUrl, requestBody, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
      }
    })
      .then((response) => {
        const habitsArray = response.data.habits.map((habitObj) => habitObj.habit);
        setHabits(habitsArray);

        // Pre-select cells based on the number of days
        response.data.habits.forEach((habitObj, habitIndex) => {
          const days = habitObj.days;
          if (days > 0 && days <= 21) {
            const selectedCells = [...Array(days)].map((_, dayIndex) => `${habitIndex}-${dayIndex}`);
            setSelectedCells((prevSelectedCells) => [...prevSelectedCells, ...selectedCells]);
          }
        });
      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log(error.response.data.message);
        } else {
          console.log("Backend server is down. Try again.");
        }
      });
  }, []);



  const toggleCell = (habit, habitIndex, dayIndex) => {
    console.log("habit::", habit);
    const habitName = habit.trim();
  
    console.log("habitIndex::", habitIndex);
    console.log("dayIndex::", dayIndex);
    const cell = `${habitIndex}-${dayIndex}`;
    setSelectedCells((prevSelectedCells) => {
      const isSelected = prevSelectedCells.includes(cell);
  
      
  
      const newSelectedCells = [...prevSelectedCells, cell];
      const habitRowCells = [...Array(21)].map((_, index) => `${habitIndex}-${index}`);
      const isRowCompleted = habitRowCells.every((cell) => newSelectedCells.includes(cell));
       // Calculate the change in score based on consecutive selection
       let scoreChange = 0;
      if (isRowCompleted) {
        const habitCompleted = habits[habitIndex].name;
        alert(`Congratulations! ${habitCompleted} completed! Adding 1000 points to your score!`);
        console.log("increasing score");
        scoreChange += 1000;
        const newScore = score + scoreChange;
        updateScoreInBackend(newScore);
        // updateScoreInBackend(newScore);
        // setScore(newScore);
        // console.log(newScore);
        setCompletedHabits((prevCompletedHabits) => [...prevCompletedHabits, habitIndex]);
      }
  
     
      if (dayIndex > 0) {
        const previousCell = `${habitIndex}-${dayIndex - 1}`;
        const isPreviousSelected = prevSelectedCells.includes(previousCell);
  
        // If the previous cell is not selected, deduct 60 points for breaking consecutive selection
        if (!isPreviousSelected) {
          console.log("decreasing score");
          scoreChange -= 60;
        }
      }
  
      // If the current cell is not selected, add 10 points for selecting a new cell
      if (!isSelected) {
        
        console.log("increasing score");
        scoreChange += 10;

        completeHabit(user.usermail, habit)
        .then((updatedDays) => {
          // Set the updated days for the habit
          const updatedHabits = [...habits];
          updatedHabits[habitIndex].days = updatedDays;
          setHabits(updatedHabits);
        })
        .catch((error) => {
          console.error('Error incrementing habit days:', error);
        });
    }
      
  
      // Update the score based on the calculated change
      const newScore = score + scoreChange;
      updateScoreInBackend(newScore);
      setScore(newScore);
      console.log(newScore);
  
      return newSelectedCells;
    });
  };
  


  const addHabit = () => {
    const habitName = prompt('Enter the habit name:');
    if (habitName) {
      // const requestConfig = {
      //   headers: {
      //     'x-api-key': 'nJz4ShTPac1maB1X1S9biaOik9Qvl7yr3yXKeaxV'
      //   }
      // };

      const requestBody = {
        usermail: user.usermail,
        habit: habitName,
      };

      axios.post(addUrl, requestBody, {headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
      }})
        .then((response) => {
          // Handle the response if needed
          console.log(response.data);
          // Add the new habit to the local state
          setHabits(prevHabits => [...prevHabits, habitName]);
        })
        .catch((error) => {
          // Handle the error if needed
          console.log(error);
        });
    }

  };

  const deleteHabitFromBackend = async (habitIndex, habit) => {
    // const requestConfig = {
    //   headers: {
    //     'x-api-key': 'nJz4ShTPac1maB1X1S9biaOik9Qvl7yr3yXKeaxV'
    //   }
    // };

    const requestBody = {
      usermail: user.usermail,
      habit: habit,
    };

    try {
      console.log("calling backend deletehabitUrl");
      const response = await axios.post(deletehabitUrl, requestBody, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        }
      });
      // Handle the response if needed
      console.log("inside deletehabitfrombackend");
      console.log(response.data);

      // After successful deletion from the backend, update the state to remove the habit
      setHabits(prevHabits => prevHabits.filter((_, index) => index !== habitIndex));
      setCompletedHabits((prevCompletedHabits) =>
        prevCompletedHabits.filter((completedIndex) => completedIndex !== habitIndex)
      );
    } catch (error) {
      // Handle the error if needed
      console.log(error);
    }
  };

  const deleteHabit = (habit) => {
    const habitIndex = habits.indexOf(habit.habit);
    if (habitIndex !== -1) {
      // Delete the habit from the backend
      console.log("habit to delete:", habit.habit);
      deleteHabitFromBackend(habitIndex, habit.habit);
    }
  };


  return (
    <div className="table-container">

      <button className="productivity-btn" onClick={addHabit}>Add Habit</button>
      <div className="table-wrapper">
        <table className="habit-table">
          <tbody>
            <tr>
              <th className="first-column"></th>
              {[...Array(21)].map((_, dayIndex) => (
                <th key={dayIndex}>{dayIndex + 1}</th>
              ))}
            </tr>

            {habits.map((habit, habitIndex) => (
              <tr key={habitIndex} classname={completedHabits.includes(habitIndex) ? 'completed-habit' : ''}>
                <td className="first-column">{habit}</td>
                {[...Array(21)].map((_, dayIndex) => {
                  const cell = `${habitIndex}-${dayIndex}`;
                  const isSelected = selectedCells.includes(cell);
                  const isCompletedHabit = completedHabits.includes(habitIndex);
                  const isClickable = !isCompletedHabit || isSelected;

                  return (
                    <td
                      key={dayIndex}
                      className={isSelected ? 'selected' : ''}
                      onClick={isClickable ? () => toggleCell(habit, habitIndex, dayIndex) : null}
                    ></td>
                  );
                })}
                <td>
                  <button className="del-icon" onClick={() => deleteHabit({ habit })}><FaTrashAlt /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default HabitTracker;
