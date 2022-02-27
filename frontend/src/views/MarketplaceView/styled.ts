import styled from 'styled-components';

export namespace Styled {
  export const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  `;

  export const Welcome = styled.div`
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `

  export const Content = styled.div`
    display: flex;
    flex: 2;
    width: 50%;
    flex-direction: column;
  `

  export const Input = styled.input`
    flex: 2;
    font-size: 20px;
    padding: 6px;
    padding-left: 12px;
    border-radius: 16px;
    border-width: 0px;
    margin-left: 8px;
  `;

  export const Item = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    
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
}