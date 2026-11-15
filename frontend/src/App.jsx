import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

import RoleRoute from './routes/RoleRoute';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BrowseListings from './pages/buyer/BrowseListings';
import ListingDetails from './pages/buyer/ListingDetails';
import MyReservations from './pages/buyer/MyReservations';
import BuyerProfile from './pages/buyer/BuyerProfile';

import SellerDashboard from './pages/seller/SellerDashboard';
import AddListing from './pages/seller/AddListing';
import ManageListings from './pages/seller/ManageListings';
import IncomingReservations from './pages/seller/IncomingReservations';
import SellerProfile from './pages/seller/SellerProfile';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">

        <Navbar />

        <main className="flex-1">
          <Routes>

            {/* Public Homepage */}
            <Route
              path="/"
              element={
                user
                  ? <Navigate
                      to={user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'}
                      replace
                    />
                  : <LandingPage />
              }
            />

            {/* Authentication */}
            <Route
              path="/login"
              element={
                user
                  ? <Navigate
                      to={user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'}
                      replace
                    />
                  : <LoginPage />
              }
            />

            <Route
              path="/register"
              element={
                user
                  ? <Navigate
                      to={user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'}
                      replace
                    />
                  : <RegisterPage />
              }
            />

            {/* Public Food Marketplace */}
            <Route
              path="/buyer/browse"
              element={<BrowseListings />}
            />

            {/* Public Product Details */}
            <Route
              path="/buyer/listings/:id"
              element={<ListingDetails />}
            />

            {/* Protected Buyer Routes */}
            <Route
              path="/buyer/dashboard"
              element={
                <RoleRoute role="buyer">
                  <BuyerDashboard />
                </RoleRoute>
              }
            />

            <Route
              path="/buyer/reservations"
              element={
                <RoleRoute role="buyer">
                  <MyReservations />
                </RoleRoute>
              }
            />

            <Route
              path="/buyer/profile"
              element={
                <RoleRoute role="buyer">
                  <BuyerProfile />
                </RoleRoute>
              }
            />

            {/* Protected Seller Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <RoleRoute role="seller">
                  <SellerDashboard />
                </RoleRoute>
              }
            />

            <Route
              path="/seller/add-listing"
              element={
                <RoleRoute role="seller">
                  <AddListing />
                </RoleRoute>
              }
            />

            <Route
              path="/seller/listings"
              element={
                <RoleRoute role="seller">
                  <ManageListings />
                </RoleRoute>
              }
            />

            <Route
              path="/seller/reservations"
              element={
                <RoleRoute role="seller">
                  <IncomingReservations />
                </RoleRoute>
              }
            />

            <Route
              path="/seller/profile"
              element={
                <RoleRoute role="seller">
                  <SellerProfile />
                </RoleRoute>
              }
            />

            {/* Unknown Routes */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </main>

        <Footer />

      </div>
    </ThemeProvider>
  );
}

export default App;