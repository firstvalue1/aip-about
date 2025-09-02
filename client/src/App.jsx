import {  BrowserRouter, Route, Routes  } from "react-router-dom";
import InvestmentInfo from "./components/invest_Info.jsx";
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invest" element={<InvestmentInfo />} />
      </Routes>
    
    </BrowserRouter>

  );
}

export default App;