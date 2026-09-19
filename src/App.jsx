import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Sales from '@/pages/Sales';
import Customers from '@/pages/Customers';
import AIInsights from '@/pages/AIInsights';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';

function AppPage({ children }) {
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Dashboard is now the default page. */}
          <Route path="/" element={<AppPage><Dashboard /></AppPage>} />
          <Route path="/dashboard" element={<AppPage><Dashboard /></AppPage>} />

          <Route path="/products" element={<AppPage><Products /></AppPage>} />
          <Route path="/sales" element={<AppPage><Sales /></AppPage>} />
          <Route path="/customers" element={<AppPage><Customers /></AppPage>} />
          <Route path="/ai-insights" element={<AppPage><AIInsights /></AppPage>} />
          <Route path="/reports" element={<AppPage><Reports /></AppPage>} />
          <Route path="/settings" element={<AppPage><Settings /></AppPage>} />

          {/* Any old/unknown route opens the dashboard. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
