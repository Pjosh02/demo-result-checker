import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import LoginPortal from './components/LoginPortal';
import ResultReport from './components/ResultReport';
import TeacherPortal from './components/TeacherPortal';
import AdminPortal from './components/AdminPortal';

function AppContent() {
  const { currentRole, viewingResult, isTeacherLoggedIn, isAdminLoggedIn } = useContext(AppContext);

  return (
    <div className="app-container" style={{ height: currentRole === 'admin' ? '100vh' : 'auto' }}>

      {/* Main portal switcher router */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: currentRole === 'admin' ? '100%' : 'auto' }}>
        {currentRole === 'student' && (
          viewingResult ? <ResultReport /> : <LoginPortal />
        )}

        {currentRole === 'teacher' && (
          isTeacherLoggedIn ? <TeacherPortal /> : <LoginPortal />
        )}

        {currentRole === 'admin' && (
          isAdminLoggedIn ? <AdminPortal /> : <LoginPortal />
        )}
      </main>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
