//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Marketplace {

  IERC20 private leoToken;
  IERC20 private usdtToken;
  
  constructor(address _leoToken, address _usdtToken) {
    leoToken = IERC20(_leoToken);
    usdtToken = IERC20(_usdtToken);
  }

  function sellLeoForUsdt() public {
    
  }
}