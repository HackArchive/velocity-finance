import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Base from "./pages/Base";
import Home from "./pages/Home";
import Trade from "./pages/Trade";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faucet" element={<Base />} />
          <Route path="/trade/:symbol" element={<Trade />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
