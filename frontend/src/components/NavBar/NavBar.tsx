import { Link } from "react-router-dom";
import { Styled } from './styled'

export const NavBar = () => {
  return (
  <Styled.Wrapper>
    <Link to='/'>Marketplace</Link>
    <Link to='/account'>Account</Link>
    <Link to='/gallery'>NFT Gallery</Link>
  </Styled.Wrapper>)
}