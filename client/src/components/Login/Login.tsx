import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import '../auth.css';
import { Context } from '../..';
import {observer} from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {store} = useContext(Context);
  const navigate = useNavigate();

  useEffect(()=>{
    if(store.isAuth){
        navigate('/');
    }
  }, [store.isAuth])

  const onFinish = async (values: any) => {

    setLoading(true);
    setErrorMessage('');

    const message = await store.login(values.email, values.password);

    if(message){
      setErrorMessage(message);
      console.log('Error: ', message);
    }
    else{
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Good to see you again</h2>
      <div className="form-container">
      <Form
        name="loginForm"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
        
          name="email"
          label="Your email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Your password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            }
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        {
          errorMessage && (
            <div>
              <p className='errorMessage'>{errorMessage}</p>
            </div>
          )
        }
        <Form.Item>
          <Button type="primary" htmlType="submit" className='submit-button' loading={loading}>
            Log in
          </Button>
        </Form.Item>
        <p>
          Don't have an account? <a href="/registration">Register</a>
        </p>
      </Form>
      </div>
    </div>
  );
};

export default observer(Login);
