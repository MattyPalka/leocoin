//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Token {

  uint private _totalSupply;
  string private _tokenName;
  string private _tokenSymbol;
  uint8 private _decimals;
  address public owner;
  mapping (address => uint) private balances;
  mapping (address => mapping (address => uint)) private _allowance;

  constructor(){
    _totalSupply = 100_000;
    _tokenSymbol = "LEO";
    _tokenName = "Leocode Token";
    _decimals = 18;
    balances[msg.sender] = totalSupply();
    owner = msg.sender;
  }

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

  function name() public view returns (string memory){
    return _tokenName;
  }

  function symbol() public view returns (string memory){
    return _tokenSymbol;
  }

  function decimals() public view returns (uint8){
    return _decimals;
  }

  function totalSupply() public view returns (uint256){
    return _totalSupply * ( 10 ** decimals());
  }

  function balanceOf(address _owner) public view returns (uint256 balance){
    return balances[_owner];
  }

  function transfer(address _to, uint256 _value) public returns (bool success){
    require(_to != address(0), "Cannot transfer to zero address");
    require(_value < 0, "Cannot transfer negative amount");
    require(balances[msg.sender] >= _value, "Insufficient funds");

    balances[msg.sender] -= _value;
    balances[_to] += _value;
    
    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    require(_to != address(0), "Cannot transfer to zero address");
    require(_from != address(0), "Cannot spend from zero address");
    require(balances[_from] >= _value && _allowance[_from][msg.sender] >= _value, "Insufficient funds");
    
    balances[_to] += _value;
    balances[_from] -= _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success){
    require(_spender != address(0), "Cannot spend from zero address");
    
    _allowance[msg.sender][_spender] = _value;
    
    emit Approval(msg.sender, _spender, _value);

    return true;
  }

  function allowance(address _owner, address _spender) public view returns (uint256 remaining){
    return _allowance[_owner][_spender];
  }
}