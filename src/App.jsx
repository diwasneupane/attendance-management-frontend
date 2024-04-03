import { useState } from "react";
import "./App.css";
import Login from "./Components/Login/Login";
import Attendance from "./Components/Attendance/Attendance";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Login /> */}
      <Attendance />
    </>
  );
}

export default App;
