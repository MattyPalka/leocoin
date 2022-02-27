import styled from 'styled-components'

export namespace ConnectedView {
  export const ViewWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  `

  export const Welcome = styled.div`
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `

  export const Data = styled.div`
    display: flex;
    flex: 2;
    flex-direction: column;
  `

  export const Button = styled.button<{$type?: 'primary' | 'success'}>`
  font-size: 20px;
  background-color: ${({$type}) => $type === 'success' ? '#66CC91' : '#57ABFF'};
  border-radius: 16px;
  color: #ffffff;
  border-width: 0px;
  padding: 6px 12px;
  width: max-content;
  font-weight: 600;
  cursor: pointer;

  &:hover{
    background-color: ${({$type}) => $type === 'success' ? '#219653' : '#258CF3'};
    transition: all 150ms ease-in-out;
  }
  `;

  export const ETHButtons = styled.div`
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
  `;
}