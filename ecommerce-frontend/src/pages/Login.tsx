import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { auth } from '../FireBase';
import { getUser, useLoginMutation } from '../redux/api/userApi';
import { userExist, userNotExist } from '../redux/reducer/UserReducer';
import { MessageResponse } from '../types/api-types';

const Login = () => {
  const dispatch = useDispatch();
  const [gender, setGender] = useState('');
  const [date, setDate] = useState('');

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      // console.log({
      //   name: user.displayName!,
      //   email: user.email!,
      //   photo: user.photoURL!,
      //   gender,
      //   role: 'user',
      //   dob: date,
      //   _id: user.uid,
      // });

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: 'user',
        dob: date,
        _id: user.uid,
      });

      if ('data' in res) {
        if (res.data?.message) {
          toast.success(res.data.message);
        }
        const data = await getUser(user.uid);
        dispatch(userExist(data?.user!));
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error('Sign In Fail');
    }
  };

  return (
    <div className='login'>
      <main>
        <h1 className='heading'>Login</h1>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value=''>Select Gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          ></input>
        </div>

        <div>
          <p>Already Signed in Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
