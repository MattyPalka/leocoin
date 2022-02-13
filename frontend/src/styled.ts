import styled from 'styled-components';

export const ContentWrapper = styled.div`
  margin: 10% 5%;
  width: 90%;
  height: 80%;
  display: flex;
  background-color: #17191C;
  border-radius: 16px;
  color: #FFFFFF;
`

export const ConnectWalletView = styled.div`
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  h2 {
    font-size: 36px;
  }

  button {
    background-color: #57ABFF;
    border-radius: 16px;
    color: #ffffff;
    border-width: 0px;
    padding: 16px;
    font-weight: 700;
    font-size: 24px;
    min-width: 500px;
    cursor: pointer;

    &:hover{
      background-color: #258CF3;
      transition: all 150ms ease-in-out;
    }
  }
`