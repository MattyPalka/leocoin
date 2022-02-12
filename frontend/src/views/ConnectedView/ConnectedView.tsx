import { TokenData } from "../../types/TokenData"

interface Props {
    tokenData: TokenData
}

export const ConnectedView = ({tokenData} : Props) => {
    return (
        <>
        <div>{tokenData.signerAddress}</div>
        <div>{tokenData.tokenBalance} {tokenData?.tokenSymbol}</div>
        </>
    )
}