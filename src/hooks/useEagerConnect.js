import { useEffect } from 'react'
import useAuth from './useAuth'

const ConnectorNames =  {
    Injected : "injected",
    WalletConnect : "walletconnect",
    BSC : "bsc"
}


const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId")
    if (connectorId && connectorId !== ConnectorNames.BSC) {
      login(connectorId)
    }
  }, [login])
}

export default useEagerConnect
