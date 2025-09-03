import {  BrowserRouter, Route, Routes  } from "react-router-dom";
import InvestmentInfo from "./components/invest_Info.jsx";
import AddInvestment from "./components/add-investment.jsx";
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invest" element={<InvestmentInfo />} />
        <Route path="/add-investment" element={<AddInvestment />} />
      </Routes>
    
    </BrowserRouter>

  );
}

export default App;