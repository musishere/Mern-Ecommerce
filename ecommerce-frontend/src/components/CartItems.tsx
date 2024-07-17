import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { server } from '../redux/Store';
import { CartItems } from '../types/types';

type cartItemsProps = {
  cartItems: CartItems;
  incrementHandler: (cartItem: CartItems) => void;
  decrementHandler: (cartItem: CartItems) => void;
  removeHandler: (id: string) => void;
};

const CartItems = ({
  cartItems,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: cartItemsProps) => {
  const { photo, name, productId, price, quantity, stock } = cartItems;
  return (
    <div className='cart-item'>
      <img src={`${server}/${photo}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>€{price}</span>
      </article>

      <div>
        <button onClick={() => decrementHandler(cartItems)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItems)}>+</button>
      </div>

      <button onClick={() => removeHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItems;
