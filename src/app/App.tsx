import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { MapsScreen } from './components/MapsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { RecordDetailScreen } from './components/RecordDetailScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { EditProfileScreen } from './components/EditProfileScreen';
import { ChangePasswordScreen } from './components/ChangePasswordScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { AboutScreen } from './components/AboutScreen';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterEmailScreen } from './components/RegisterEmailScreen';
import { RegisterPasswordScreen } from './components/RegisterPasswordScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>(undefined);

  const handleNavigation = (screen: string, recordId?: number) => {
    if (screen === 'logout') {
      setIsAuthenticated(false);
      setCurrentScreen('welcome');
      return;
    }

    if (recordId !== undefined) {
      setSelectedRecordId(recordId);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    // Fluxo de autenticação
    if (currentScreen === 'splash') {
      return <SplashScreen onFinish={() => setCurrentScreen('welcome')} />;
    }

    if (currentScreen === 'welcome') {
      return <WelcomeScreen onNavigate={handleNavigation} />;
    }

    if (currentScreen === 'login') {
      return <LoginScreen onNavigate={(screen) => {
        if (screen === 'home') {
          setIsAuthenticated(true);
        }
        handleNavigation(screen);
      }} />;
    }

    if (currentScreen === 'register-email') {
      return <RegisterEmailScreen onNavigate={handleNavigation} />;
    }

    if (currentScreen === 'register-password') {
      return <RegisterPasswordScreen onNavigate={(screen) => {
        if (screen === 'home') {
          setIsAuthenticated(true);
        }
        handleNavigation(screen);
      }} />;
    }

    // Telas principais do app (após autenticação)
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigation} />;
      case 'register':
        return <RegisterScreen onNavigate={handleNavigation} />;
      case 'maps':
        return <MapsScreen />;
      case 'history':
        return <HistoryScreen onNavigate={handleNavigation} />;
      case 'record-detail':
        return <RecordDetailScreen onNavigate={handleNavigation} recordId={selectedRecordId} />;
      case 'profile':
        return <ProfileScreen onNavigate={handleNavigation} />;
      case 'edit-profile':
        return <EditProfileScreen onNavigate={handleNavigation} />;
      case 'change-password':
        return <ChangePasswordScreen onNavigate={handleNavigation} />;
      case 'notifications':
        return <NotificationsScreen onNavigate={handleNavigation} />;
      case 'about':
        return <AboutScreen onNavigate={handleNavigation} />;
      default:
        return <HomeScreen onNavigate={handleNavigation} />;
    }
  };

  const showNavigation = isAuthenticated && !['splash', 'welcome', 'login', 'register-email', 'register-password', 'edit-profile', 'record-detail', 'change-password', 'notifications', 'about'].includes(currentScreen);

  return (
    <div className="size-full bg-[#F1F1F1]">
      {renderScreen()}
      {showNavigation && (
        <Navigation currentScreen={currentScreen} onNavigate={handleNavigation} />
      )}
    </div>
  );
}