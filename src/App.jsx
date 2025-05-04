import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import TeamPage from './components/TeamPage';
import BattlePage from './components/BattlePage';
import BattleHistory from './components/BattleHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pokede from "./components/pokedex";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/team" element={<TeamPage />} /> {/* Correct usage of element */}
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/history" element={<BattleHistory />} />
        <Route path="/pokedex" element={<Pokede />} />
      </Routes>
    </Router>
  );
}

export default App;
