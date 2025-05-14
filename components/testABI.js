export const TEST_ABI = [
    // Fonctions de ERC20
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    
    // Fonction du faucet
    "function requestTokens() public"
  ];
