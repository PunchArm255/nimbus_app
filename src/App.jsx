import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Welcome from "./pages/welcome";
import { UserProvider } from "./lib/context/user"; // Import the UserProvider

function App() {
  return (
    <UserProvider> {/* Wrap the entire app with UserProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;