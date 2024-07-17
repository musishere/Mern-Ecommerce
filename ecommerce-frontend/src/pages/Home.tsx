import ProductCart from '../components/ProductCart';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/Loading';
import { useLatestProductsQuery } from '../redux/api/productApi';
import { addToCart } from '../redux/reducer/CartReducer';
import { CartItems } from '../types/types';

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery('');
  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItems) => {
    if (cartItem.stock < 1) return toast.error('Out of Stock');
    dispatch(addToCart(cartItem));

    toast.success('Added to Cart');
  };
  if (isError) {
    toast.error('Can not fetch products');
  }
  return (
    <div className='home'>
      <section></section>
      <h1>
        Latest Products
        <Link to={'/search'} className='findmore'>
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Skeleton />
        ) : (
          data?.products.map((i) => (
            <ProductCart
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
