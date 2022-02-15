import React from "react"
import { Button, Input, Wrapper } from "./styled"

interface Props {
  buttonText: string;
  inputValue: string;
  inputOnChange: (e: React.ChangeEvent<HTMLInputElement>)=> void;
  onButtonClick: VoidFunction;
}

export const InputWithButton = ({ buttonText, inputValue, inputOnChange, onButtonClick }: Props) => {
  return (
  <Wrapper>
    <Input value={inputValue} onChange={inputOnChange} placeholder='type here...'/>
    <Button onClick={onButtonClick}>{buttonText}</Button>
  </Wrapper>
  )
}