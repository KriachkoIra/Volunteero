import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import LoginPage from "./components/LoginPage";
import RouteNotFound from "./components/RouteNotFound";
import TasksPage from "./components/TasksPage";
import ProfilePage from "./components/ProfilePage";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/participate" element={<TasksPage />} />
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
