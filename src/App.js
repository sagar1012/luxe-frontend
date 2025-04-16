import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';

const isAuthenticated = () => !!localStorage.getItem('authToken');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/add-patient" element={isAuthenticated() ? <AddPatient /> : <Navigate to="/" />} />
        <Route path="/edit-patient/:id" element={isAuthenticated() ? <EditPatient /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
