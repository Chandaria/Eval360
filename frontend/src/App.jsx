import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ManagerDashboard from './pages/ManagerDashboard';
import Logo from './components/Logo';

// Dummy Sidebar for layout purposes
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-parchment flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col shadow-lg z-10">
        <div className="p-6 border-b border-gray-800 flex justify-center">
          <Logo inverted={true} />
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-teal bg-opacity-20 text-gold border border-teal border-opacity-30">
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
            <span className="font-medium">Suppliers</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
            <span className="font-medium">Evaluations</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
            <span className="font-medium">Contracts</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
          Manager Role
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/manager" replace />} />
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
