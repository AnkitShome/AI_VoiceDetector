import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './landing_page/home/HomePage';
import Prof_dash from './landing_page/prof_dash/Prof_dash';
import Prof_SignUp from './landing_page/signup/Prof-Signup';
import Prof_Login from './landing_page/signup/Prof-Login';
import Stud_SignUp from './landing_page/signup/Stud-Signup';
import Navbar from './landing_page/Navbar';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Navbar/>
  <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/prof-signup' element={<Prof_SignUp/>}/>
      <Route path='/stud-signup' element={<Stud_SignUp/>}/>
      <Route path='/prof-dash' element={<Prof_dash/>}/>
      <Route path='/prof-login' element={<Prof_Login/>}/>
  </Routes>
  </BrowserRouter>
);

