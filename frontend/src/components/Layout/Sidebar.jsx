import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  Receipt, 
  Banknote, 
  BarChart3,
  GraduationCap,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      name: 'Students',
      href: '/students',
      icon: GraduationCap,
      description: 'Student Management'
    },
    {
      name: 'Staff',
      href: '/staff',
      icon: UserCheck,
      description: 'Staff Management'
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCard,
      description: 'Fee Payments'
    },
    {
      name: 'Expenses',
      href: '/expenses',
      icon: Receipt,
      description: 'Expense Tracking'
    },
    {
      name: 'Salaries',
      href: '/salaries',
      icon: Banknote,
      description: 'Staff Payroll'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      description: 'Financial Reports'
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-luxury-xl z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-luxury-200">
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-gold-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-luxury-900">EduManage</h2>
              <p className="text-xs text-luxury-600">Pro System</p>
            </div>
          </Link>
          
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-luxury-100 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-luxury-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="h-5 w-5 mr-3 transition-colors duration-200" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-luxury-500 group-hover:text-primary-600 transition-colors duration-200">
                    {item.description}
                  </div>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-luxury-200">
          <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-gold-500 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-luxury-900">Pro Version</p>
                <p className="text-xs text-luxury-600">All features unlocked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;