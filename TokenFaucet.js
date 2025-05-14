import React, { useState, useEffect } from 'react';
import { connectWallet, switchToSepoliaNetwork, getTokenBalance, requestTokens } from '../services/contractService';
import { CONFIG } from '../config';

function TokenFaucet() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [networkOk, setNetworkOk] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const init = async () => {
      // Vérifier si MetaMask est déjà connecté
      if (window.ethereum && window.ethereum.selectedAddress) {
        const addr = window.ethereum.selectedAddress;
        setAccount(addr);
        
        // Vérifier et changer de réseau si nécessaire
        const networkSwitched = await switchToSepoliaNetwork();
        setNetworkOk(networkSwitched);
        
        if (networkSwitched) {
          const bal = await getTokenBalance(addr);
          setBalance(bal);
        }
      }

      // Écouteurs d'événements pour MetaMask
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
      }
    };

    init();

    // Nettoyage des écouteurs d'événements
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setBalance('0');
    } else {
      setAccount(accounts[0]);
      const bal = await getTokenBalance(accounts[0]);
      setBalance(bal);
    }
  };

  const handleConnect = async () => {
    setError('');
    try {
      const addr = await connectWallet();
      if (addr) {
        setAccount(addr);
        
        // Basculer vers Sepolia
        const networkSwitched = await switchToSepoliaNetwork();
        setNetworkOk(networkSwitched);
        
        if (networkSwitched) {
          const bal = await getTokenBalance(addr);
          setBalance(bal);
        } else {
          setError('Veuillez basculer sur le réseau Sepolia');
        }
      }
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
    }
  };

  const handleGetTokens = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (!networkOk) {
        const switched = await switchToSepoliaNetwork();
        if (!switched) {
          setError('Veuillez basculer sur le réseau Sepolia');
          setIsLoading(false);
          return;
        }
        setNetworkOk(true);
      }
      
      await requestTokens();
      
      // Mettre à jour le solde après avoir reçu des tokens
      const bal = await getTokenBalance(account);
      setBalance(bal);
      
      setSuccess('Vous avez reçu 1000 MOCK tokens!');
    } catch (err) {
      setError('Erreur: ' + (err.message || 'Échec de la transaction'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="token-faucet">
      <h2>Mock Token Faucet</h2>
      <p>Contrat: <a href={`https://sepolia.etherscan.io/address/${CONFIG.CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer">{CONFIG.CONTRACT_ADDRESS}</a></p>
      
      {!account ? (
        <button onClick={handleConnect}>Connecter MetaMask</button>
      ) : (
        <div>
          <p>Compte connecté: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
          <p>Solde MOCK: {balance}</p>
          
          <button 
            onClick={handleGetTokens} 
            disabled={isLoading || !networkOk}
          >
            {isLoading ? 'Transaction en cours...' : 'Obtenir 1000 MOCK'}
          </button>
          
          {!networkOk && <p className="warning">Veuillez vous connecter au réseau Sepolia</p>}
        </div>
      )}
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default TokenFaucet;