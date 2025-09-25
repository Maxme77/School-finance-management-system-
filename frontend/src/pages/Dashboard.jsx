import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, DollarSign, TrendingUp, Calendar, Phone } from 'lucide-react';
import { studentService, staffService, reportService } from '../services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalFees: 0,
    netIncome: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [studentsResponse, staffResponse, reportsResponse] = await Promise.all([
        studentService.getAll(),
        staffService.getAll(),
        reportService.getReports()
      ]);

      setStats({
        totalStudents: studentsResponse.data?.length || 0,
        totalStaff: staffResponse.data?.length || 0,
        totalFees: reportsResponse.data?.summary?.totalFeesCollected || 0,
        netIncome: reportsResponse.data?.summary?.netIncome || 0
      });

      // Get recent students (last 5)
      const students = studentsResponse.data || [];
      const sortedStudents = students
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentStudents(sortedStudents);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-luxury-600">{title}</p>
            <p className="text-2xl font-bold text-luxury-900">{value}</p>
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
                {trendValue}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="card-body animate-pulse">
                <div className="h-4 bg-luxury-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-luxury-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-luxury-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Welcome Back!</h1>
              <p className="text-luxury-600 mt-2">
                Here's what's happening at your institution today.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-luxury-600">
                <Calendar className="h-5 w-5" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={GraduationCap}
          color="bg-gradient-to-r from-primary-500 to-primary-600"
          trend="up"
          trendValue="+12% from last month"
        />
        <StatCard
          title="Staff Members"
          value={stats.totalStaff.toLocaleString()}
          icon={Users}
          color="bg-gradient-to-r from-gold-500 to-gold-600"
          trend="up"
          trendValue="+2 new hires"
        />
        <StatCard
          title="Total Fees Collected"
          value={`$${stats.totalFees.toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend="up"
          trendValue="+8% this month"
        />
        <StatCard
          title="Net Income"
          value={`$${stats.netIncome.toLocaleString()}`}
          icon={TrendingUp}
          color={stats.netIncome >= 0 ? 
            "bg-gradient-to-r from-emerald-500 to-emerald-600" : 
            "bg-gradient-to-r from-red-500 to-red-600"
          }
          trend={stats.netIncome >= 0 ? "up" : "down"}
          trendValue={stats.netIncome >= 0 ? "Profitable" : "Loss"}
        />
      </div>

      {/* Recent Students and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-luxury-900">Recent Students</h3>
          </div>
          <div className="card-body">
            {recentStudents.length === 0 ? (
              <p className="text-luxury-500 text-center py-8">No students found</p>
            ) : (
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-luxury-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-luxury-900">{student.name}</p>
                        <p className="text-sm text-luxury-600">
                          {student.class || 'No class assigned'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-luxury-900">
                        ${parseFloat(student.dues || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-luxury-600">Outstanding</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-luxury-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.href = '/students'}
                className="p-4 rounded-lg border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-center"
              >
                <GraduationCap className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <p className="font-medium text-luxury-900">Add Student</p>
                <p className="text-sm text-luxury-600">Enroll new student</p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/staff'}
                className="p-4 rounded-lg border-2 border-gold-200 hover:border-gold-300 hover:bg-gold-50 transition-all duration-200 text-center"
              >
                <Users className="h-8 w-8 text-gold-600 mx-auto mb-2" />
                <p className="font-medium text-luxury-900">Add Staff</p>
                <p className="text-sm text-luxury-600">Hire new staff member</p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/payments'}
                className="p-4 rounded-lg border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-center"
              >
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-luxury-900">Record Payment</p>
                <p className="text-sm text-luxury-600">Process fee payment</p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/reports'}
                className="p-4 rounded-lg border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-center"
              >
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-luxury-900">View Reports</p>
                <p className="text-sm text-luxury-600">Financial analytics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;