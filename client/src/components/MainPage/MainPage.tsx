import React, { useContext, useEffect } from 'react';
import '../auth.css';
import { Context } from '../..';
import {observer} from 'mobx-react-lite';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';


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
    <h1>{store.isAuth ? `User is logged in ${store.user.email}` : "LOG IN!"}</h1>
    </>
  );
};

export default observer(MainPage);
