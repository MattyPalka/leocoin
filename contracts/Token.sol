//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Token {

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

  function name() public pure returns (string memory){
    return "Leocode Token";
  }

  function symbol() public pure returns (string memory){
    return "LEO";
  }

  function decimals() public pure returns (uint8){
    return 18;
  }

  function totalSupply() public view returns (uint256){
    return 100_000 * (this.decimals() * 10);
  }

  function balanceOf(address _owner) public view returns (uint256 balance){

  }

  function transfer(address _to, uint256 _value) public returns (bool success){

  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){

  }

  function approve(address _spender, uint256 _value) public returns (bool success){

  }

  function allowance(address _owner, address _spender) public view returns (uint256 remaining){

  }
}