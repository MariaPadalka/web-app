import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import '../auth.css';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // Send a POST request to your server's /login endpoint
      const response = await axios.post('http://localhost:5000/api/login', values);

      // Handle a successful login
      console.log('Login successful', response.data);
      setLoading(false);

      // You can redirect the user to another page here if needed
    } catch (error: any) {
      // Handle login errors
      setLoading(false);
      console.error('Login failed', error);

      if (error.response && error.response.data.message) {
        error.response.data.message.error(error.response.data.message);
      } else {
        error.response.data.message.error('Login failed. Please try again later.');
      }
    }
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

export default Login;
