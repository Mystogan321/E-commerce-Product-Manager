import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, preferences } = useSelector((state: RootState) => state.user);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Order History</h3>
          {orders.map(order => (
            <div key={order.id} className="mb-4">
              {/* Display order details */}
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Preferences</h3>
          {/* Display user preferences */}
        </div>
      </div>
    </div>
  );
};

export default Profile; 