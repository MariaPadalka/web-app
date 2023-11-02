import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../auth.css';
import { Context } from '../..';

const Registration = ({ admin = false, title = 'Welcome'}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {store} = useContext(Context);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {     
    setLoading(true);
    setErrorMessage('');
    
    const message = await store.registration(values.email, values.password, admin);

    if(message){
      setErrorMessage(message);
      console.log('Error: ', message);
    }
    else{
      form.resetFields();
      navigate('/activation');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2> {title} </h2>
      <div className="form-container">
      <Form
        form={form}
        name="registrationForm"
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
            {
              type: 'email',
              message: 'Please enter a valid email address!',
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
            },
            {
              min: 6,
              message: 'Password must be at least 6 characters long',
            },
            {
              max: 32,
              message: 'Password cannot exceed 32 characters',
            },
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
            Sign up
          </Button>
        </Form.Item>
        {
          title === 'Welcome' && (
            <p>
              Already have an account? <a href="/login">Log in</a>
            </p>
          )
        }
      </Form>
      </div>
    </div>
  );
};

export default Registration;
