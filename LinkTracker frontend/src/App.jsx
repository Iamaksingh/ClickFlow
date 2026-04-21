import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LinkAnalytics from "./pages/LinkAnalytics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/links/:id/analytics" element={<LinkAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}