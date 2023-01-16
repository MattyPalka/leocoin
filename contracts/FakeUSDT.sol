//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeUSDT is ERC20 {
  constructor() ERC20("Fake USDT", "USDT") {
  }

  function decimals() public pure override returns (uint8) {
    return 6;
  }

  function giveTokens(address _beneficient, uint _value) public {
    _mint(_beneficient, _value);
  }
}