// src/App.tsx
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';
import Registration from './components/Registration/Registration';
import EmailSent from './components/Activation/Activation';
import './App.css';
import { Context } from '.';
import {observer} from 'mobx-react-lite';
import AdminPanel from './components/AdminPanel/AdminPanel';
import { Spin } from 'antd';

function App() {

  const {store} = useContext(Context);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    if(localStorage.getItem('token')){
      store.checkAuth()
    }
  }, [])

  if(store.isLoading){
    return <Spin/>
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/activation" element={<EmailSent />} />
          <Route path="/admin-panel" element={<AdminPanel/>}/>
          <Route path="/" element = {<MainPage />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default observer(App);
