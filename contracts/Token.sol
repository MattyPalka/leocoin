//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Token {

  address public owner;
  mapping (address => uint) private balances;
  mapping (address => mapping (address => uint)) private allowed;

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

  function transfer(address _to, uint256 _value) public returns (bool success){
    require(_to != address(0), "Cannot transfer to zero address");
    require(balances[msg.sender] >= _value, "Insufficient funds");

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
    require(msg.sender == owner, "Only owner can withdraw LEO");
    require(balances[address(this)] >= _value, "Insufficient funds");

    balances[address(this)] -= _value;
    balances[msg.sender] += _value;

    emit Transfer(address(this), msg.sender, _value);

    return true;
  }

  function paymeup() public payable {
    require(msg.sender == owner, "Only owner can withdraw ETH");
    // WITHDRAW CONTRACT ETH TO OWNER


  }

  function buy() public payable {
    // sell 1ETH = 100LEO
    // VEST TOKEN FOR A WEEK
  }
}