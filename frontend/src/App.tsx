import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import FileUpload from './components/FileUpload';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Top menu */}
        <nav className="bg-stone-200 border-b border-stone-300 p-4 flex space-x-4">
          <Link
            to="/"
            className="px-3 py-2 rounded hover:bg-stone-300 text-slate-800 font-semibold"
          >
            Home
          </Link>
          <Link
            to="/upload"
            className="px-3 py-2 rounded hover:bg-stone-300 text-slate-800 font-semibold"
          >
            File Upload
          </Link>
        </nav>

        {/* Main content */}
        <main className="flex-grow p-20 bg-gradient-to-br from-stone-50 to-slate-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<FileUpload />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}