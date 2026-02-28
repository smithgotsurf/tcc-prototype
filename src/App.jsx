import { Routes, Route } from "react-router-dom";
import EstimatorShell from "./estimator/EstimatorShell";
import CustomerView from "./customer/CustomerView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EstimatorShell />} />
      <Route path="/view/:id" element={<CustomerView />} />
    </Routes>
  );
}
