import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterVerifyPage from './pages/RegisterVerifyPage';
import ContactPage from './pages/ContactPage';
import ScholarshipsPublicPage from './pages/ScholarshipsPublicPage';
import DashboardPage from './pages/DashboardPage';
import AdvertisementsPage from './pages/AdvertisementsPage';
import ApplicationWizardPage from './pages/ApplicationWizardPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import AdvertisementDetailPage from './pages/AdvertisementDetailPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import PublicScholarshipDetailPage from './pages/PublicScholarshipDetailPage';
import UniversitiesPublicPage from './pages/UniversitiesPublicPage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
}

/** Redirect logged-in users away from public auth pages */
function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/scholarships" element={<ScholarshipsPublicPage />} />
          <Route path="/universities" element={<UniversitiesPublicPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/scholarship/:id" element={<PublicScholarshipDetailPage />} />
          <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
          <Route path="/register/verify/:token" element={<RegisterVerifyPage />} />

          {/* Authenticated portal */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/advertisements" element={<PrivateRoute><AdvertisementsPage /></PrivateRoute>} />
          <Route path="/advertisement/:id" element={<PrivateRoute><AdvertisementDetailPage /></PrivateRoute>} />
          <Route path="/apply/:adId/:programId" element={<PrivateRoute><ApplicationWizardPage /></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute><MyApplicationsPage /></PrivateRoute>} />
          <Route path="/application/:id" element={<PrivateRoute><ApplicationDetailPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
