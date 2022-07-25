import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { useToast } from '../state/hooks'
import { connectorsByName } from '../utils/web3React'
import { setupNetwork } from '../utils/wallet'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  
  const login = useCallback((connectorID) => {
      const connector = connectorsByName[connectorID]
      if (connector) {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork()
          if (hasSetup) {
            activate(connector)
          }
        } else {
          connector.walletConnectProvider = undefined
          toastError(error.name, error.message)
        }
      })
    } else {
      toastError("Can't find connector", 'The connector config is wrong')
    }
  }, [])

  return { login, logout: deactivate }
}

export default useAuth
