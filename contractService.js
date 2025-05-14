import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { CONFIG, SEPOLIA_NETWORK } from '../config';
import { TEST_ABI } from '../abis/testABI';

const provider = new BrowserProvider(window.ethereum); // ok pour v6

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask n'est pas installé. Veuillez installer MetaMask pour continuer.");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error("Erreur lors de la connexion à MetaMask:", error);
    return null;
  }
};

export const switchToSepoliaNetwork = async () => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    });
    return true;
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SEPOLIA_NETWORK],
        });
        return true;
      } catch (addError) {
        console.error("Erreur lors de l'ajout du réseau Sepolia:", addError);
        return false;
      }
    }
    console.error("Erreur lors du changement de réseau:", switchError);
    return false;
  }
};

export const getContract = async () => {
  if (!window.ethereum) return null;

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONFIG.CONTRACT_ADDRESS, TEST_ABI, signer);
};

export const getTokenBalance = async (address) => {
  try {
    const contract = await getContract();
    if (!contract) return "0";
    const balance = await contract.balanceOf(address);
    return formatUnits(balance, 18);
  } catch (error) {
    console.error("Erreur lors de la récupération du solde:", error);
    return "0";
  }
};

export const requestTokens = async () => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error("Contrat non disponible");
    
    const tx = await contract.requestTokens();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Erreur lors de la demande de tokens:", error);
    throw error;
  }
};
