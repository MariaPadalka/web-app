import React, { useContext, useState } from 'react';
import { Button } from 'antd';
import './Header.css';
import { Context } from '../..';
import {observer} from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';



const Header = ({ adminButtonVisible = true , userPanelButtonVisible = false}) => {
  const [loading, setLoading] = useState(false);
  const {store} = useContext(Context);
  const navigate = useNavigate();

  const onLogout = async (values: any) => {

    setLoading(true);
    const message = await store.logout();

    if(message){
        console.log('Error: ', message);
    }
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="header">
      <div className="user-info">
        <span>Welcome, {store.user.email}</span>
      </div>
      <div>
      {
          store.user.isAdmin && adminButtonVisible && (
            <Button className='admin-button' onClick={() => navigate('/admin-panel')}>
              Admin Panel
            </Button>
            )
        }
      {
        store.user.isAdmin && userPanelButtonVisible && (
          <Button className='user-button'  onClick={() => navigate('/')}>User Panel</Button>
        )
      }
      <Button onClick={onLogout} className='logout-button' loading = {loading}>Log out</Button>
      </div>
    </div>
  );
};

export default observer(Header);
