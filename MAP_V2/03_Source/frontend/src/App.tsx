import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './authentication/context/AuthProvider';
import { NavigationProvider } from './navigation/NavigationProvider';
import { PortalRoutes } from './portal/routing/PortalRoutes';
import { AIContextProvider } from './ai';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <AIContextProvider>
            <PortalRoutes />
          </AIContextProvider>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
