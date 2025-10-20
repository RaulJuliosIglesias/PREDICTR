import { Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from './components/core/MainLayout';
import HomePage from './pages/HomePage';
import MarketDetailPage from './pages/MarketDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const isAuthed = useAuthStore((s) => !!s.user);
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/markets/:id" element={<MarketDetailPage />} />
        <Route path="/portfolio" element={isAuthed ? <PortfolioPage /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
