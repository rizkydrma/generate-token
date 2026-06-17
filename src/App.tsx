import { Route, Routes } from "react-router-dom";
import BaznasPage from "./baznas";
import HomePage from "./Home";
import PQUPage from "./pqu";
import WargaquPage from "./wargaqu";
import Navbar from "./components/Navbar";

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pqu" element={<PQUPage />} />
                <Route path="/baznas" element={<BaznasPage />} />
                <Route path="/wargaqu" element={<WargaquPage />} />
            </Routes>
        </>
    );
};

export default App;
