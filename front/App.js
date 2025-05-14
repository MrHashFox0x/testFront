import React from 'react';
import './App.css';
import TokenFaucet from './components/TokenFaucet';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MOCK Token Faucet</h1>
        <p>Obtenez des tokens MOCK gratuits sur le réseau Sepolia</p>
      </header>
      <main>
        <TokenFaucet />
      </main>
      <footer>
        <p>© 2025 - Application de test pour contrat ERC20</p>
      </footer>
    </div>
  );
}

export default App;
