import toast from 'react-hot-toast';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../FireBase';
import { User } from '../types/types';

import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';

interface userPropsType {
  user: User | null;
}

const Header = ({ user }: userPropsType) => {
  const [isOpen, setisOpen] = useState<boolean>(false);

  const logOutHandler = async () => {
    try {
      await signOut(auth);
      toast.success('Sign out');
      setisOpen(false);
    } catch (error) {
      toast.error('Sign out Failed');
    }
  };

  return (
    <nav className='header'>
      <Link onClick={() => setisOpen(false)} to={'/'}>
        Home
      </Link>
      <Link onClick={() => setisOpen(false)} to={'/search'}>
        <FaSearch />
      </Link>
      <Link onClick={() => setisOpen(false)} to={'/cart'}>
        <FaShoppingBag />
      </Link>

      {user?._id ? (
        <>
          <button onClick={() => setisOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === 'admin' && (
                <Link onClick={() => setisOpen(false)} to='admin/dashboard'>
                  Admin
                </Link>
              )}
              <Link onClick={() => setisOpen(false)} to='/orders'>
                Orders
              </Link>
              <button onClick={logOutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={'/login'}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
