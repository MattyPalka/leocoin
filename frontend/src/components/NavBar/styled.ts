import styled from 'styled-components';

export namespace Styled {
  export const Wrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 14px;

    a {
      padding: 14px;
      color: #FFFFFF;

      &:hover{
        color: #ffb500;
        transition: all 150ms ease-in-out;
      }
    }
  `
}