import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FindConsultants from './pages/FindConsultants';
import BecomeConsultant from './pages/BecomeConsultant';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find-consultants" element={<FindConsultants />} />
            <Route path="/become-a-consultant" element={<BecomeConsultant />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}