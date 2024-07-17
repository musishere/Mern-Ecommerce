import axios from 'axios';
import toast from 'react-hot-toast';
import { ChangeEvent, useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { server } from '../redux/Store';
import { saveShippingInfo } from '../redux/reducer/CartReducer';
import { CartReducerInitialState } from '../types/user-types';

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    country: '',
    state: '',
    pinCode: '',
  });

  const { cartItems, total } = useSelector(
    (state: { CartReducer: CartReducerInitialState }) => state.CartReducer
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate('/cart');
  }, [cartItems]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      navigate('/pay', {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='shipping'>
      <button className='back-btn' onClick={() => navigate('/cart')}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          required
          placeholder='Adress'
          type='text'
          name='address'
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          required
          placeholder='City'
          type='text'
          name='city'
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <input
          required
          placeholder='Country'
          type='text'
          name='country'
          value={shippingInfo.country}
          onChange={changeHandler}
        />
        <input
          required
          placeholder='state'
          type='text'
          name='state'
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select
          name='country'
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value=''>Choose Country</option>
          <option value='Pakistan'>Pakistan</option>
        </select>
        <input
          required
          placeholder='Pin Code'
          type='number'
          name='pinCode'
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type='submit'>Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
