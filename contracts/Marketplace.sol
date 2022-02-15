//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./LeoToken.sol";
import "./FakeUSDT.sol";

contract Marketplace {

  LeoToken private leoToken;
  FakeUSDT private usdtToken;
  
  constructor(address _leoToken, address _usdtToken) {
    leoToken = LeoToken(_leoToken);
    usdtToken = FakeUSDT(_usdtToken);
  }

  function exchange(string memory _purchasedTokenSymbol, uint _purchaseAmount) public view{
    if (keccak256(abi.encodePacked(_purchasedTokenSymbol)) == keccak256(abi.encodePacked(leoToken.symbol()))) {
      
    } else if (keccak256(abi.encodePacked(_purchasedTokenSymbol)) == keccak256(abi.encodePacked(leoToken.symbol()))) {

    }
  }
}