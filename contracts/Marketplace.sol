//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./LeoToken.sol";
import "./FakeUSDT.sol";

import "hardhat/console.sol";

contract Marketplace {

  LeoToken private leoToken;
  FakeUSDT private usdtToken;
  enum TokenName {LEO, USDT}
  
  constructor(address _leoToken, address _usdtToken) {
    leoToken = LeoToken(_leoToken);
    usdtToken = FakeUSDT(_usdtToken);

    usdtToken.giveMeTokens(100_000 * (10 * usdtToken.decimals()));
  }



  function exchange(uint _usdtAmount, TokenName _purchaseDirection) public payable{
    
    uint leoAmount = _usdtAmount * 100 / 3 ;
    uint actualLeoAmount = leoAmount / (10 ** usdtToken.decimals()) * (10 ** leoToken.decimals());


    if (_purchaseDirection == TokenName.LEO){
      require(usdtToken.balanceOf(msg.sender) > _usdtAmount, "Insufficient funds");
      require(leoToken.balanceOf(address(leoToken)) > actualLeoAmount, "Insufficient leo to sell");
      usdtToken.transferFrom(msg.sender, address(this), _usdtAmount);
      leoToken.transferFrom(address(leoToken), msg.sender, actualLeoAmount);

    } else if (_purchaseDirection == TokenName.USDT) {
      require(leoToken.balanceOf(msg.sender) > actualLeoAmount, "Insufficient funds");
      require(usdtToken.balanceOf(address(this)) > _usdtAmount, "Insufficient usdt to sell");

      leoToken.transferFrom(msg.sender, address(this), actualLeoAmount);
      usdtToken.transfer(msg.sender, _usdtAmount);
    } else {
      // DO NOTHING 
    }
  }
}