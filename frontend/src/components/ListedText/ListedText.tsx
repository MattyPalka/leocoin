import { Label, Wrapper, Text } from "./styled"

interface Props {
  label: string;
  text?: string;
}

export const ListedText = ({label, text}: Props) => {
  return <Wrapper>
    <Label>{label}</Label>
    <Text>{text}</Text>
  </Wrapper>
}