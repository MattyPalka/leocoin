//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Token {

  address public owner;
  mapping (address => uint) private balances;
  mapping (address => mapping (address => uint)) private allowed;
  mapping (address => uint) private vestedAmount;
  mapping (address => uint) private vestedUntilDate;

  constructor(){
    balances[address(this)] = totalSupply();
    owner = msg.sender;
    allowed[address(this)][msg.sender] = totalSupply(); 
  }

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

  function totalSupply() public pure returns (uint256){
    return 100_000 * ( 10 ** decimals());
  }

  function balanceOf(address _owner) public view returns (uint256 balance){
    return balances[_owner];
  }

  function canSpendTokens(address _spender, uint _value) public view returns (bool canSpend){
    require(balances[_spender] >= _value, "Insufficient funds");
    if(vestedUntilDate[_spender] > block.timestamp){
      require(balances[_spender] - vestedAmount[_spender] >= _value, "Funds still vested");
    }

    return true;
  }

  function transfer(address _to, uint256 _value) public returns (bool success){
    require(_to != address(0), "Cannot transfer to zero address");
    canSpendTokens(msg.sender, _value);

    balances[msg.sender] -= _value;
    balances[_to] += _value;
    
    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    require(_to != address(0), "Cannot transfer to zero address");
    require(_from != address(0), "Cannot spend from zero address");
    require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value, "Insufficient spending funds");
    
    balances[_to] += _value;
    balances[_from] -= _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success){
    require(_spender != address(0), "Cannot approve for zero address");
    
    allowed[msg.sender][_spender] = _value;
    
    emit Approval(msg.sender, _spender, _value);

    return true;
  }

  function allowance(address _owner, address _spender) public view returns (uint256 remaining){
    return allowed[_owner][_spender];
  }

  function withdrawLeo(uint _value) public returns (bool success) {
    require(isOwner(), "Only owner can withdraw LEO");
    require(balances[address(this)] >= _value, "Insufficient funds");

    balances[address(this)] -= _value;
    balances[msg.sender] += _value;

    emit Transfer(address(this), msg.sender, _value);

    return true;
  }

  function paymeup() public payable {
    require(isOwner(), "Only owner can withdraw ETH");

    uint weiAmount = address(this).balance;
    
    require(weiAmount > 0, "No funds to send");
    
    payable(msg.sender).transfer(weiAmount);
  }

  function buy() public payable {
    require(msg.value > 0, "Minimum 1 wei to buy LEO");

    uint tokensToSend = msg.value * 100;

    require(vestedUntilDate[msg.sender] < block.timestamp, "Cannot buy in a week of prev");
    require(balances[address(this)] >= tokensToSend, "Cannot sell more than have");
    
    balances[address(this)] -= tokensToSend;
    balances[msg.sender] += tokensToSend;
    vestedUntilDate[msg.sender] = block.timestamp + (7 days);
    vestedAmount[msg.sender] = tokensToSend;

    emit Transfer(address(this), msg.sender, tokensToSend);
  }

  function isOwner() public view returns (bool isOwnerTrue) {
    if (msg.sender == owner) {
      return true;
    }
    return false;
  }
}