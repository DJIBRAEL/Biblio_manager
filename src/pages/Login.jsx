import { useState } from 'react';
import { Book, User, Lock } from 'lucide-react';
import logoDit from '../assets/logo-dit.png';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-container">
            <div className="logo-wrapper">
              <Book size={32} className="logo-icon" />
              <img src={logoDit} alt="DIT Logo" className="login-dit-logo" />
            </div>
          </div>
          <h1>Connexion</h1>
          <p>Veuillez entrer vos identifiants pour vous connecter</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-field-group">
            <label>Nom d'utilisateur</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Entrez votre nom"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-field-group">
            <label>Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
         <div data-v-82382d9d="" class="form-check">
         <input data-v-82382d9d="" class="form-check-input" type="checkbox" id="defaultCheck1"></input>
         <label data-v-82382d9d="" class="form-check-label text-muted fw-normal" for="defaultCheck1"> Se souvenir de moi </label></div>
          <div className="login-options">
            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
          </div>
        <div data-v-82382d9d="" class="mt-2 text-muted">Vérification prête</div>
          <button type="submit" className="login-btn">Connexion</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
