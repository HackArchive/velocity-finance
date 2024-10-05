import { BrowserRouter, Route, Routes } from "react-router-dom";
import Base from "./pages/Base";
import Home from "./pages/Home";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faucet" element={<Base />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
