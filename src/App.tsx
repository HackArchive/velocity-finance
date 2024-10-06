import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Trade from "./pages/Trade";

export default function App() {
  return (
    <div className="bg-[#141414] text-white">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trade/:symbol" element={<Trade />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
