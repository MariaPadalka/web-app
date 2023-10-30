import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import '../auth.css';
import pic from './emailSent.jpg';

const EmailSent = () => {
    const [SendEmailLoading, setSendEmailLoading] = useState(false);    

  const sendEmail = async () => {
    try{
        setSendEmailLoading(true);
        // Send a POST request to your server's /login endpoint
        const response = await axios.post('http://localhost:5000/api/sendEmail');
        // Handle a successful sending
        console.log('Sent successfully', response.data);
        setSendEmailLoading(false);
    }  catch(error: any) {
        setSendEmailLoading(false);

        if (error.response && error.response?.data?.message) {
            console.log("message", error.response.data.message);
        } else {
            error.response.data.message.error('Failed. Please try again later.');
        }
    }
  }
  return (
    <div className="centered-container">
      <p className='big-text'>Verify your email</p>
      <p className="medium">Check your email & click the link to activate your account.</p>
      <img
        src={pic}
        alt="Email sent"
        width="auto"
        height="200"
        />
      <div className="horizontal-container">
        <Button type="primary" htmlType="submit" className='emails-button' onClick={sendEmail} loading={SendEmailLoading}>
            Resend Email
        </Button>
        <Button type="primary" htmlType="submit" className='emails-button'>
            Enter New Email
        </Button>
      </div>
    </div>
  );
};

export default EmailSent;
function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error('Function not implemented.');
}

