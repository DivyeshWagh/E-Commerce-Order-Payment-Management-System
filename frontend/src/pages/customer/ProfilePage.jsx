import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, ShieldCheck, MapPin, Package, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">My Profile</h1>
        <p className="text-sm text-slate-400">Account metadata and security roles</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center font-extrabold text-2xl text-white shadow-xl">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.email?.split('@')[0]}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">User ID</span>
            <p className="font-mono text-sm font-bold text-indigo-300">{user?.userId}</p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">Assigned Roles</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {user?.roles?.map((role, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <Link to="/orders" className="glass-card p-4 rounded-2xl hover:border-indigo-500/50 transition-colors flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">My Orders</h4>
              <p className="text-[10px] text-slate-400">Track shipments</p>
            </div>
          </Link>

          <Link to="/addresses" className="glass-card p-4 rounded-2xl hover:border-indigo-500/50 transition-colors flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">My Addresses</h4>
              <p className="text-[10px] text-slate-400">Delivery locations</p>
            </div>
          </Link>

          {isAdmin() && (
            <Link to="/admin" className="glass-card p-4 rounded-2xl hover:border-indigo-500/50 transition-colors flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Admin Console</h4>
                <p className="text-[10px] text-slate-400">Store metrics</p>
              </div>
            </Link>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl glass-card text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
