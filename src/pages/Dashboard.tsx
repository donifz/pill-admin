import React from 'react';
import { 
  UserGroupIcon, 
  BuildingStorefrontIcon, 
  TagIcon
} from '@heroicons/react/24/outline';
import { doctorService, pharmacyService } from '../services';

const Dashboard: React.FC = () => {
  const [stats, setStats] = React.useState({
    doctors: 0,
    pharmacies: 0,
    categories: 0,
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [doctors, pharmacies, categories] = await Promise.all([
          doctorService.getDoctors(),
          pharmacyService.getPharmacies(),
          doctorService.getCategories(),
        ]);

        setStats({
          doctors: doctors.length,
          pharmacies: pharmacies.length,
          categories: categories.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statsItems = [
    {
      name: 'Total Doctors',
      value: stats.doctors,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Pharmacies',
      value: stats.pharmacies,
      icon: BuildingStorefrontIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Doctor Categories',
      value: stats.categories,
      icon: TagIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your admin dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statsItems.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden bg-white rounded-lg shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 ${item.color} rounded-md`}>
                  <item.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow rounded-lg">
          <div className="p-6">
            <p className="text-sm text-gray-500">
              No recent activity to display
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 