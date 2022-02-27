import styled from 'styled-components';

export namespace Styled {
  export const Wrapper = styled.div`
    width: 25%;
    margin: 16px;
  `;

  export const Image = styled.img`
    width: 100%;
  `;

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
    margin: 8px;

    &:hover{
      background-color: ${({$type}) => $type === 'success' ? '#219653' : '#258CF3'};
      transition: all 150ms ease-in-out;
    }
  `;

  export const Description = styled.div`
    text-align: center;
    font-size: 1.1rem;
    padding: 14px;
  `;
}