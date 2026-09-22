import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Boxes, Users, ArrowLeft } from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 min-h-screen p-4 flex flex-col shrink-0">
      <div className="mb-6 px-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
        <h2 className="text-xl font-bold text-white">Management</h2>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'gradient-btn text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
