import React, { useContext, useEffect } from 'react';
import '../auth.css';
import { Context } from '../..';
import {observer} from 'mobx-react-lite';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import Tasks from '../Tasks/Table';
import NewTask from '../Tasks/NewTask';
import './main.css';


const MainPage = () => {
  const {store} = useContext(Context);
  const navigate = useNavigate();

// eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    if(!store.isAuth){
        navigate('/login');
    }
  }, [])

  return (
    <>
    <Header />
    <div className='main-container'>
    <p className='medium-text'> Add new task: </p>
    <NewTask/>
    <Tasks />
    </div>
    </>
  );
};

export default observer(MainPage);
