import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import TermsPage from './pages/TermsPage';
import CoursesPage from './pages/CoursesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import DashboardPage from './pages/DashboardPage';
import StudyPlansPage from './pages/StudyPlansPage';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/terms"
          element={
            <ProtectedRoute>
              <TermsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <AssignmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <StudyPlansPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
