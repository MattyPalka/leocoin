import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 16px 0;
  display: flex;
  
`;

export const Input = styled.input`
  flex: 2;
  font-size: 20px;
  padding: 6px;
  padding-left: 12px;
  border-radius: 16px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-width: 0px;
`;

export const Button = styled.button`
  font-size: 20px;
  background-color: #57ABFF;
  border-radius: 16px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;
  color: #ffffff;
  border-width: 0px;
  padding: 6px 12px;
  width: max-content;
  font-weight: 600;
  cursor: pointer;
  word-break: keep-all;

  &:hover{
    background-color: #258CF3;
    transition: all 150ms ease-in-out;
  }
`;