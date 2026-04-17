import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<div style={{padding: '2rem'}}><h1>Welcome to CampusKart</h1><p>Frontend Foundation Ready.</p></div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
