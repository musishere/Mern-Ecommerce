import AdminSidebar from '../../components/admin/AdminSidebar';
import TableHOC from '../../components/admin/TableHOC';
import toast from 'react-hot-toast';
import { ReactElement, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Column } from 'react-table';
import { Skeleton } from '../../components/Loading';
import { server } from '../../redux/Store';
import { useAllProductsQuery } from '../../redux/api/productApi';
import { customError } from '../../types/api-types';
import { userReducerInitialState } from '../../types/user-types';

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: 'Photo',
    accessor: 'photo',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Price',
    accessor: 'price',
  },
  {
    Header: 'Stock',
    accessor: 'stock',
  },
  {
    Header: 'Action',
    accessor: 'action',
  },
];

const Products = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );
  const { data, isLoading, isError, error } = useAllProductsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (error) toast.error((error as customError).data.message);

  useEffect(() => {
    if (data)
      setRows(
        data.products.map((i) => ({
          photo: <img src={`${server}/${i.photo}`} />,
          name: i.name,
          price: i.price,
          stock: i.stock,
          action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    'dashboard-product-box',
    'Products',
    rows.length > 6
  )();

  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main>{isLoading ? <Skeleton /> : Table}</main>
      <Link to='/admin/product/new' className='create-product-btn'>
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
