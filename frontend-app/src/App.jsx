import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import AppRoutes from './routes/Routes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;