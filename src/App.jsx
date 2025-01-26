import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Welcome from "./pages/welcome";
import PostPreview from "./pages/PostPreview";
import { UserProvider } from "./lib/context/user"; // Import the UserProvider
import { ThemeProvider } from "./lib/context/theme"; // Add this import

function App() {
  return (
    <ThemeProvider> {/* Add this wrapper */}
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/PostPreview" element={<PostPreview />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;