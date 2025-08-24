import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar.component";
import HomePage from "./pages/home.page.jsx";
import SignUpPage from "./pages/signup.page";
import LoginPage from "./pages/login.page";
import SettingsPage from "./pages/settings.page";
import ProfilePage from "./pages/profile.page";
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-dots loading-xl"></span>
    </div>
  );

  return (
    <>
      <div data-theme={theme}>
        <Toaster />
        <Navbar />

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>

      </div>
    </>
  )
}

export default App;