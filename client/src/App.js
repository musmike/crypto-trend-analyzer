import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Details from "./components/Details";
import Navbar from "./components/Navbar";


function App() {
    const user = localStorage.getItem("token");

    return (
        <div>

            <Navbar/>

            <Routes>
                {user && <Route path="/details" exact element={<Details />} />}
                <Route path="/register" exact element={<Register />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/" exact element={<Home />} />
                <Route path="/details" element={<Navigate replace to="/login" />} />
            </Routes>


        </div>

    );
};

export default App;
