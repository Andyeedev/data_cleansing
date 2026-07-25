import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { AuthProvider } from './context/AuthContext';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider initialRole="viewer">
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
