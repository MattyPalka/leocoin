//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeUSDT is ERC20 {
  constructor() ERC20("Fake USDT", "USDT") {
    _mint(msg.sender, 1_000 * (10 ** decimals()));
  }

  function decimals() public pure override returns (uint8) {
    return 6;
  }

  function giveMeTokens(uint _value) public {
    _mint(msg.sender, _value * (10 ** decimals()));
  }
}