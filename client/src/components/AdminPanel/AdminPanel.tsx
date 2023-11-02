import React, { useContext, useEffect, useState } from 'react';
import Header from '../Header/Header';
import { observer } from 'mobx-react-lite';
import UsersTable from './UsersTable';
import './admin.css';
import Registration from '../Registration/Registration';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';

const AdminPanel = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();
  const {store} = useContext(Context);

  const toggleRegistration = () => {
    setShowRegistration(!showRegistration);
  };

  useEffect(() => {
    if(!store.isAuth){
      navigate('/login');
    }
  }, []);


  return (
    <>
      <Header adminButtonVisible={false} userPanelButtonVisible={true} />
      <div className='main-container'>
        <Button className='add-admin-button' onClick={toggleRegistration}>
          {showRegistration ? 'Close' : 'Click to add new admin:'}
        </Button>
        {showRegistration ? (
          <Registration admin={true} title={'New administrator'} />
        ) : null}

        <UsersTable />
      </div>
    </>
  );
};

export default observer(AdminPanel);
