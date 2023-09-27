import logo from './logo.svg';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home.js"
import Dashboard from './pages/Dashboard.js'
import Login from "./pages/Login.js"
import Registration from "./pages/Registration.js"
import ForgotPwd from './pages/ForgotPwd';
import Info from './pages/Info';

function App() {
  return (
    <div className="App">

          <Routes>
            <Route path = "/" element={<Home />} />
            <Route path = "/dashboard" element={<Dashboard/>} />
            <Route path = "/login" element={<Login/>} />
            <Route path = "/register" element={<Registration/>} />
            <Route path = "/forgotpwd" element={<ForgotPwd/>} />
            <Route path = "/info" element={<Info/>} />
    
          </Routes>
        
    </div>
  );
}

export default App;
