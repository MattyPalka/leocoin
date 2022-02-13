import { toast } from "react-toastify";

export const setToast = (errorMessage: string) => {
  let infoString = "Sorry, something went wrong";

  if (errorMessage.includes('Cannot buy in a week of prev')) {
    infoString = "Sorry, cannot purchase within a week from previous purchase"
  } else if (errorMessage.includes('Only owner can withdraw LEO')) {
    infoString = "Sorry, Only owner can withdraw LEO"
  } else if (errorMessage.includes('Only owner can withdraw ETH')) {
    infoString = "Sorry, Only owner can withdraw ETH"
  } else if (errorMessage.includes("Insufficient funds")) {
    infoString = "Sorry, No more LEO coins available"
  }
  
  toast(infoString, {position: 'bottom-right', theme: 'dark', type: 'error'})
}
