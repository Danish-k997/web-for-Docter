import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Customers/Home.tsx";
import "./App.css";
import Navbar from "./Components/SharedCompo/Navbar.tsx";

function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      {/* Footer yahan aayega */}
    </div>
  );
}

export default App;
