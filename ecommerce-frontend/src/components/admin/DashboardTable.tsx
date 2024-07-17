import TableHOC from './TableHOC';
import { Column } from 'react-table';

interface DataType {
  _id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: string;
}

const columns: Column<DataType>[] = [
  {
    Header: 'Id',
    accessor: '_id',
  },
  {
    Header: 'Quantity',
    accessor: 'quantity',
  },
  {
    Header: 'Discount',
    accessor: 'discount',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
];

const DashboardTable = ({ data }: { data: DataType[] }) => {
  return (
    <TableHOC
      columns={columns}
      data={data}
      className='transaction-box'
      title='Top Transaction'
    />
  );
};

export default DashboardTable;
