import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';

// Lazy-loaded pages for code splitting & performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Category = lazy(() => import('./pages/Category'));
const Product = lazy(() => import('./pages/Product'));
const Guide = lazy(() => import('./pages/Guide'));
const About = lazy(() => import('./pages/About'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Contact = lazy(() => import('./pages/Contact'));
const SurgeonPortal = lazy(() => import('./pages/SurgeonPortal'));
const Wholesale = lazy(() => import('./pages/Wholesale'));
const Technology = lazy(() => import('./pages/Technology'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Auth & Admin components
const AdminRoute = lazy(() => import('./components/auth/AdminRoute'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const UserRoute = lazy(() => import('./components/auth/UserRoute'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Yükleniyor">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground sr-only">Yükleniyor...</span>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          } />
          <Route path="shop" element={
            <Suspense fallback={<PageLoader />}>
              <Shop />
            </Suspense>
          } />
          <Route path="category/:slug" element={
            <Suspense fallback={<PageLoader />}>
              <Category />
            </Suspense>
          } />
          <Route path="product/:slug" element={
            <Suspense fallback={<PageLoader />}>
              <Product />
            </Suspense>
          } />
          <Route path="guide" element={
            <Suspense fallback={<PageLoader />}>
              <Guide />
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          } />
          <Route path="shipping" element={
            <Suspense fallback={<PageLoader />}>
              <Shipping />
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          } />
          <Route path="surgeon-portal" element={
            <Suspense fallback={<PageLoader />}>
              <SurgeonPortal />
            </Suspense>
          } />
          <Route path="wholesale" element={
            <Suspense fallback={<PageLoader />}>
              <Wholesale />
            </Suspense>
          } />
          <Route path="technology" element={
            <Suspense fallback={<PageLoader />}>
              <Technology />
            </Suspense>
          } />
          <Route path="checkout" element={
            <Suspense fallback={<PageLoader />}>
              <Checkout />
            </Suspense>
          } />
          <Route path="login" element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          } />
          <Route path="reset-password" element={
            <Suspense fallback={<PageLoader />}>
              <ResetPassword />
            </Suspense>
          } />
          <Route path="privacy-policy" element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          } />
          <Route path="terms-of-service" element={
            <Suspense fallback={<PageLoader />}>
              <TermsOfService />
            </Suspense>
          } />

          {/* User Protected Routes — inside Layout so Header/Footer show */}
          <Route path="profile" element={
            <Suspense fallback={<PageLoader />}>
              <UserRoute />
            </Suspense>
          }>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            } />
          </Route>

          {/* 404 — Layout içinde Header/Footer ile birlikte */}
          <Route path="*" element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } />
        </Route>

        {/* Admin Routes — separate Layout wrapper */}
        <Route path="/admin" element={
          <Suspense fallback={<PageLoader />}>
            <AdminRoute />
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          } />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

