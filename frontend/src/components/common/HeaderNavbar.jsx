import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, ShieldCheck, MapPin, Package, Grid, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const HeaderNavbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Shop<span className="gradient-text">Verse</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full glass-input text-sm focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/products" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <Grid className="w-4 h-4" /> Products
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 gradient-btn text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons / User Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full glass-card hover:border-indigo-500/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center font-bold text-xs">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">
                    {user?.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl animate-fade-in border border-slate-700/50"
                  >
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60 transition-colors"
                    >
                      <Package className="w-4 h-4 text-emerald-400" /> My Orders
                    </Link>
                    <Link
                      to="/addresses"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-amber-400" /> My Addresses
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60 transition-colors"
                    >
                      <User className="w-4 h-4 text-cyan-400" /> My Profile
                    </Link>
                    <div className="h-px bg-slate-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="gradient-btn text-xs font-semibold px-4 py-2 rounded-full shadow-md">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-slate-300">
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 p-4 space-y-3 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-200 text-sm font-medium">
              Browse Products
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin() && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-indigo-400 text-sm font-semibold">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-300 text-sm">
                  My Orders
                </Link>
                <Link to="/addresses" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-300 text-sm">
                  My Addresses
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-slate-300 text-sm">
                  My Profile
                </Link>
                <button onClick={handleLogout} className="px-3 py-2 text-left text-rose-400 text-sm font-medium">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-2 text-center text-slate-200 text-sm glass-card rounded-xl">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-2 text-center text-white text-sm gradient-btn rounded-xl">
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderNavbar;
