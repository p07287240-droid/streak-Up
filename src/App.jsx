import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Habits from "./pages/Habits";
console.log("ROOT APP IS RUNNING");

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("streakup-user"));
    } catch {
      return null;
    }
  });

  const saveUser = (nextUser) => {
    setUser(nextUser);
    sessionStorage.setItem("streakup-user", JSON.stringify(nextUser));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={saveUser} />}/>
        <Route path="/register" element={<Register setUser={saveUser} />}/>
       <Route
         path="/habits"
         element={user ? (<Habits user={user} />) : (<Navigate to="/login" />)}/>
        <Route path="*" element={<Navigate to="/login" />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
