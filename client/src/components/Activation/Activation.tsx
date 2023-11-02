import { useContext, useEffect } from 'react';
import { Context } from '../..';
import '../auth.css';
import pic from './emailSent.jpg';
import {observer} from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

const EmailSent = () => {
  const {store} = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if(!store.isAuth){
      navigate('/login');
    }
  }, [store]);


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
      <p onClick={() => {store.logout(); navigate('/login')}} className='logout-p'> Logout </p>
    </div>
  );
};

export default observer(EmailSent);

