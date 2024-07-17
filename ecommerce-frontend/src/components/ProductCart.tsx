import { FaPlus } from 'react-icons/fa';
import { server } from '../redux/Store';
import { CartItems } from '../types/types';

type productProps = {
  name: string;
  productId: string;
  photo: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItems) => string | undefined;
};

const ProductCart = ({
  name,
  productId,
  photo,
  price,
  stock,
  handler,
}: productProps) => {
  return (
    <div className='product-card'>
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>€{price}</span>

      <div>
        <button
          onClick={() =>
            handler({ name, productId, photo, price, stock, quantity: 1 })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCart;
