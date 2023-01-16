import styled from 'styled-components';

export namespace Styled {
  export const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background-color: #17191C;
  `;

  export const Header = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `
  export const Content = styled.div`
    display: flex;
    flex-wrap: wrap;
  `
}