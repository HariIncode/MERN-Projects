import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CreateAccount from './components/CreateAccount.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateAccount />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
