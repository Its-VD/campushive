import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OTPVerify from "./pages/OTPVerify.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Notes from "./pages/Notes.jsx";
import SubjectChat from "./pages/SubjectChat.jsx";
import GeneralChat from "./pages/GeneralChat.jsx";
import GeneralInfo from "./pages/GeneralInfo.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerify />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/chat/subject" element={<SubjectChat />} />
            <Route path="/chat/general" element={<GeneralChat />} />
            <Route path="/info" element={<GeneralInfo />} />
            <Route path="/ai" element={<AIAssistant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
