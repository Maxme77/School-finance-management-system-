import { useState, useEffect } from 'react';
import { ChartBarIcon, CurrencyDollarIcon, BanknotesIcon, UserGroupIcon, TrendingUpIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { api } from '../services';

export const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth, selectedYear]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await api.reports.get(selectedMonth, selectedYear);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      showNotification('Failed to load report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  const StatCard = ({ title, value, icon: Icon, color, subtext, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>
            {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
          </p>
          {subtext && (
            <p className="text-sm text-gray-500 mt-1">{subtext}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUpIcon className={`h-4 w-4 mr-1 ${!trend.positive && 'transform rotate-180'}`} />
              <span>{trend.value}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  const SimpleBarChart = ({ data, title, color = 'luxury' }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(item => item.value));

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-600 font-medium">
                {item.label}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-${color}-500 transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-20 text-sm font-semibold text-gray-900 text-right">
                ${item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PieChart = ({ data, title }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['bg-luxury-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center space-x-6">
          <div className="relative w-32 h-32">
            <div className="w-32 h-32 rounded-full bg-gray-200 relative overflow-hidden">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const rotation = data.slice(0, index).reduce((sum, prevItem) => sum + (prevItem.value / total) * 360, 0);
                
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 rounded-full ${colors[index % colors.length].replace('bg-', 'border-')} border-8`}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((rotation + percentage * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation + percentage * 3.6 - 90) * Math.PI / 180)}%)`
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
                <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                <span className="text-sm font-semibold">${item.value.toLocaleString()}</span>
                <span className="text-xs text-gray-500">
                  ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TransactionTable = ({ transactions, title }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions?.slice(0, 10).map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial overview and analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-luxury-500"
            >
              {years.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={reportData?.summary?.totalRevenue || 0}
          icon={CurrencyDollarIcon}
          color="text-green-600"
          subtext="From student payments"
        />
        <StatCard
          title="Total Expenses"
          value={reportData?.summary?.totalExpenses || 0}
          icon={BanknotesIcon}
          color="text-red-600"
          subtext="Operational costs"
        />
        <StatCard
          title="Staff Salaries"
          value={reportData?.summary?.totalSalaries || 0}
          icon={UserGroupIcon}
          color="text-blue-600"
          subtext="Monthly payroll"
        />
        <StatCard
          title="Net Profit"
          value={reportData?.summary?.netProfit || 0}
          icon={TrendingUpIcon}
          color={reportData?.summary?.netProfit >= 0 ? "text-green-600" : "text-red-600"}
          subtext={`${((reportData?.summary?.netProfit / (reportData?.summary?.totalRevenue || 1)) * 100).toFixed(1)}% margin`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart
          data={reportData?.charts?.monthlyRevenue || []}
          title="Monthly Revenue Trend"
          color="green"
        />
        <SimpleBarChart
          data={reportData?.charts?.monthlyExpenses || []}
          title="Monthly Expenses Trend"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={reportData?.charts?.expensesByCategory || []}
          title="Expenses by Category"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Students</span>
              <span className="font-semibold">{reportData?.metrics?.totalStudents || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Staff</span>
              <span className="font-semibold">{reportData?.metrics?.totalStaff || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Average Payment</span>
              <span className="font-semibold">${reportData?.metrics?.averagePayment?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Pending Payments</span>
              <span className="font-semibold text-red-600">{reportData?.metrics?.pendingPayments || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Collection Rate</span>
              <span className="font-semibold text-green-600">
                {reportData?.metrics?.collectionRate || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <TransactionTable
        transactions={reportData?.recentTransactions || []}
        title="Recent Transactions"
      />

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Reports;