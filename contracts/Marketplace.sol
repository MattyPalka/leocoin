//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "hardhat/console.sol";

contract Marketplace is ERC1155Holder {

  address private leoToken;
  address private usdtToken;
  address private nft;

  modifier isMyToken(address _token) {
    require(_token == leoToken || _token == usdtToken, "invalid token");
    _;
  }

  constructor(address _leoToken, address _usdtToken, address _nft) {
    leoToken = _leoToken;
    usdtToken = _usdtToken;
    nft = _nft;
  }

  function calculatePrice(address _from) internal view returns (uint) {
    if (_from == leoToken){
      return 200 * (10 ** 18);
    } else {
      return 15 * (10 * 6) / 10;
    }
  }

  function exchange(address _from, address _to, uint _amount) external isMyToken(_from) isMyToken(_to) {
    uint toSend;

    if (_from == leoToken) {
      toSend = _amount * 3 / (10 ** 14);
    } else {
      toSend = _amount * (10 ** 14) / 3;
    }

    require(IERC20(_to).balanceOf(address(this)) >= toSend, "Insufficient market");
    IERC20(_from).transferFrom(msg.sender, address(this), toSend);
    IERC20(_to).transfer(msg.sender, toSend);
  }

  function buyNFT(uint _tokenId, address _with) external isMyToken(_with) {
    IERC20(_with).transferFrom(msg.sender, address(this), calculatePrice(_with));
    IERC1155(nft).safeTransferFrom(msg.sender, address(this), _tokenId, 1, "");
  }

  function sellNFT(uint _tokenId, address _for) external isMyToken(_for) {
    IERC1155(nft).safeTransferFrom(msg.sender, address(this), _tokenId, 1, "");
  }
}