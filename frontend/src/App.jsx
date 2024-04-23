import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Products from "./Products";
import PrivateRoute from "./PrivateRoute";
import { useState } from "react";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    cookies.access_token ? true : false
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    removeCookie("access_token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={<Register onRegister={handleLogin} />}
        />
        <Route element={<PrivateRoute isAuthenticated={isLoggedIn} />}>
          <Route
            path="/products"
            element={<Products onLogout={handleLogout} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
