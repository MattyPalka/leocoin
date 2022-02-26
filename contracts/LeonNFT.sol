//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Leon is ERC1155  {
  uint public constant DTS = 0;
  uint public constant BEAR = 1;
  uint public constant PTSD = 2;

  constructor() ERC1155("https://ipfs.io/ipfs/bafybeies3vp7oa5u2yf3ztz6cnitkqoyuszcqnsybgcdfx7jhin2rx3khu/{id}.json"){
    _mint(msg.sender, DTS, 1, "");
    _mint(msg.sender, BEAR, 1, "");
    _mint(msg.sender, PTSD, 1, "");
  }
}