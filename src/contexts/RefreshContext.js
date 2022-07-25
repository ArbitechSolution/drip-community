import React, { useState, useEffect } from 'react'

const FAST_INTERVAL = 10000
const SLOW_INTERVAL = 60000

const RefreshContext = React.createContext({ slow: 0, fast: 0 })


const RefreshContextProvider = ({ children }) => {
  const [slow, setSlow] = useState(0)
  const [fast, setFast] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      setFast((prev) => prev + 1)
    }, FAST_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlow((prev) => prev + 1)
    }, SLOW_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return <RefreshContext.Provider value={{ slow, fast }}>{children}</RefreshContext.Provider>
}

export { RefreshContext, RefreshContextProvider }
