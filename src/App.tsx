/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes } from "react-router-dom";
import BaznasPage from "./baznas";
import HomePage from "./Home";
import PQUPage from "./pqu";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pqu" element={<PQUPage />} />
      <Route path="/baznas" element={<BaznasPage />} />
    </Routes>
  );
};

export default App;
