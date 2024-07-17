import CartItems from '../components/CartItems';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { VscError } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { server } from '../redux/Store';
import { CartItems as cartItemType } from '../types/types';
import { cartReducerInitialState } from '../types/user-types';

import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from '../redux/reducer/CartReducer';

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { CartReducer: cartReducerInitialState }) => state.CartReducer
    );

  const dispatch = useDispatch();
  const [coupenCode, setcoupenCode] = useState<string>('');
  const [isValid, setisValid] = useState<boolean>(false);

  const incrementHandler = (cartItem: cartItemType) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: cartItemType) => {
    if (cartItem.quantity <= 1) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const { token, cancel } = axios.CancelToken.source();

    const timeoutId = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${coupenCode}`, {
          cancelToken: token,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setisValid(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setisValid(false);
          dispatch(calculatePrice());
        });
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
      cancel();
      setisValid(false);
    };
  }, [coupenCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className='cart'>
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, index) => (
            <CartItems
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={index}
              cartItems={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal:€{subtotal}</p>
        <p>Shipping Charges: €{shippingCharges}</p>
        <p>Tax: €{tax}</p>
        <p>
          Discount: <em> - €{discount}</em>
        </p>
        <p>
          <b>Total:€{total}</b>
        </p>

        <input
          type='text'
          placeholder='Coupon Code'
          value={coupenCode}
          onChange={(e) => setcoupenCode(e.target.value)}
        ></input>

        {coupenCode &&
          (isValid ? (
            <span className='green'>
              €{discount} off using the <code>{coupenCode}</code>
            </span>
          ) : (
            <span className='red'>
              Invalid Coupon <VscError />{' '}
            </span>
          ))}

        {cartItems.length > 0 && <Link to={'/shipping'}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
