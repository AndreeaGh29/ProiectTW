import './App.css';
import { BrowserRouter as Router, Route, Routes ,Link} from 'react-router-dom'
import AuthPage from './Pages/AuthPage';
import StudentPage from './Pages/StudentPage';
import ProfessorPage from './Pages/ProfessorPage';

function App() {
  return (
    <Router>
    <nav>
      <Link to="/auth">Autentificare</Link> | 
      <Link to="/student">Pagina Studentului</Link> | 
      <Link to="/professor">Pagina Profesorului</Link>|
    </nav>
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/professor" element={<ProfessorPage />} />
    </Routes>
  </Router>
  );
}

export default App;
