

import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/welcome";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import DashboardPage from "./pages/dashboard";
import VideoPage from "./pages/videopage";
import ExamPage from "./pages/exampage";
import ScorePage from "./pages/scorepage";
import ProfilePage from "./pages/profilepage";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/score" element={<ScorePage />} />
         <Route path="/Profile" element={<ProfilePage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;