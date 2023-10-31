import '../auth.css';
import pic from './emailSent.jpg';
import {observer} from 'mobx-react-lite';

const EmailSent = () => {

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
    </div>
  );
};

export default observer(EmailSent);

