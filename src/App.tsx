/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes } from "react-router-dom";
import HomePage from "./Home";
import PQUPage from "./pqu";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/pqu" element={<PQUPage />} />
		</Routes>
	);
};

export default App;
