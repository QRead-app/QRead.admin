import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import EnterEmail from './components/EnterEmail';
import OTP from './components/OTP';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import LibrarianManage from './components/LibrarianManage';
import LibrarianInfo from './components/LibrarianInfo';
import LibrarianDetail from './components/LibrarianDetail';
import BorrowerManage from './components/BorrowerManage';
import BorrowerDetail from './components/BorrowerDetail';
import SystemManage from './components/SystemManage';
import AccountSetting from './components/AccountSetting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/enter-email" element={<EnterEmail />} />
        <Route path="/OTP" element={<OTP />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/librarians" element={<LibrarianManage />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/librarian-info" element={<LibrarianInfo />} />
        <Route path="/librarians/:id" element={<LibrarianDetail />} />
        <Route path="/borrowers" element={<BorrowerManage />} />
        <Route path="/borrowers/:id" element={<BorrowerDetail />} />
        <Route path="/system" element={<SystemManage />} />
        <Route path="/account" element={<AccountSetting />} />
      </Routes>
    </Router>
  );
}

export default App;
