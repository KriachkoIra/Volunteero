import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import LoginPage from "./components/LoginPage";
import RouteNotFound from "./components/RouteNotFound";
import TasksPage from "./components/TasksPage";
import ProfilePage from "./components/ProfilePage";
import RegisterPage from "./components/RegisterPage";
import axios from "axios";
import AddTask from "./components/AddTask";
import EditTask from "./components/EditTask";

function App() {
  axios.defaults.baseURL = "http://localhost:4567";
  axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/participate" element={<TasksPage />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/edit-task/:id" element={<EditTask />} />
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
