
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/auth_page.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [hashedPassword, setPassword] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, hashedPassword }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.userType === 'student') {
          navigate('/student');
        } else if (data.userType === 'professor') {
          navigate('/professor');
        }
    } else {
        console.error('Conectare eșuată:', data.error);
        setShowTooltip(true);
      }
    } catch (error) {
      console.error('Eroare la conectare:', error);
      setShowTooltip(true);
    }
    
  };

  const handleViewEvents = () => {
    navigate('/student'); 
  };

    return (
      <div className="auth-container">
        <h1>Autentificare</h1>
        <form>
          <div className="form-group">
            <label>Nume de utilizator:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
  
          <div className="form-group">
            <label>Parolă:</label>
            <input
              type="password"
              value={hashedPassword}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
  
          <div className="form-group">
            <label>Rol:</label>
            <select>
              <option value="student">Student</option>
              <option value="professor">Profesor</option>
            </select>
          </div>
  
          <button type="button" onClick={handleLogin}>
            Autentificare
          </button>
        </form>
      </div>
    );
  };

export default Login;
