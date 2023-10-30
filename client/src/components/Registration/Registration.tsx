import React from 'react';
import { Form, Input, Button } from 'antd';
import '../auth.css';

const Registration = () => {
  const onFinish = (values: any) => {
    console.log('Received values:', values);
    // Тут можна додати логіку реєстрації
  };

  return (
    <div className="auth-container">
      <h2>Welcome!</h2>
      <div className="form-container">
      <Form
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
        <Form.Item>
          <Button type="primary" htmlType="submit" className='submit-button'>
            Sign in
          </Button>
        </Form.Item>
        <p>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </Form>
      </div>
    </div>
  );
};

export default Registration;
