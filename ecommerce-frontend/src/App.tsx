import './components/Loading';
import Header from './components/Header';
import Loader from './components/admin/Loader';
import Loading from './components/Loading';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import OrderDetails from './pages/OrderDetails';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import { onAuthStateChanged } from 'firebase/auth';
import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { auth } from './FireBase';
import { getUser } from './redux/api/userApi';
import { userExist, userNotExist } from './redux/reducer/UserReducer';
import { userReducerInitialState } from './types/user-types';

const Cart = lazy(() => import('./pages/Cart'));
const Search = lazy(() => import('./pages/Search'));
const Home = lazy(() => import('./pages/Home'));
const Shipping = lazy(() => import('./pages/Shipping'));

//Admin routes importing
const Dashboard = lazy(() => import('./pages/admin/dashboard'));
const Products = lazy(() => import('./pages/admin/products'));
const Customers = lazy(() => import('./pages/admin/customers'));
const Transaction = lazy(() => import('./pages/admin/transaction'));
const Barcharts = lazy(() => import('./pages/admin/charts/barcharts'));
const Piecharts = lazy(() => import('./pages/admin/charts/piecharts'));
const Linecharts = lazy(() => import('./pages/admin/charts/linecharts'));
const Coupon = lazy(() => import('./pages/admin/apps/coupon'));
const Stopwatch = lazy(() => import('./pages/admin/apps/stopwatch'));
const Toss = lazy(() => import('./pages/admin/apps/toss'));
const NewProduct = lazy(() => import('./pages/admin/management/newproduct'));
const ProductManagement = lazy(
  () => import('./pages/admin/management/productmanagement')
);
const TransactionManagement = lazy(
  () => import('./pages/admin/management/transactionmanagement')
);
const CheckOut = lazy(() => import('./pages/CheckOut'));
// Rotues

const App = () => {
  const { user, loading } = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);

        if (data) {
          dispatch(userExist(data.user));
        }
      } else dispatch(userNotExist());
    });
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <BrowserRouter>
      <Header user={user} />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* LOGIN NOT REQUIRED */}
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />{' '}
          <Route path='/cart' element={<Cart />} />
          {/* NOT LOGGED IN ROUTE */}
          <Route
            path='/login'
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />
          {/* LOGIN REQUIRED	 */}
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path='/shipping' element={<Shipping />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/order/:id' element={<OrderDetails />} />
            <Route path='/pay' element={<CheckOut />} />
          </Route>
          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminRoute={true}
                isAdmin={user?.role === 'admin' ? true : false}
              />
            }
          >
            <Route path='/admin/dashboard' element={<Dashboard />} />
            <Route path='/admin/product' element={<Products />} />
            <Route path='/admin/customer' element={<Customers />} />
            <Route path='/admin/transaction' element={<Transaction />} />
            {/* Charts */}
            <Route path='/admin/chart/bar' element={<Barcharts />} />
            <Route path='/admin/chart/pie' element={<Piecharts />} />
            <Route path='/admin/chart/line' element={<Linecharts />} />
            {/* Apps */}
            <Route path='/admin/app/coupon' element={<Coupon />} />
            <Route path='/admin/app/stopwatch' element={<Stopwatch />} />
            <Route path='/admin/app/toss' element={<Toss />} />

            {/* Management */}
            <Route path='/admin/product/new' element={<NewProduct />} />

            <Route path='/admin/product/:id' element={<ProductManagement />} />

            <Route
              path='/admin/transaction/:id'
              element={<TransactionManagement />}
            />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position='bottom-center' />
    </BrowserRouter>
  );
};

export default App;
