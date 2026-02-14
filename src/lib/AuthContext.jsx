import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    setIsLoadingPublicSettings(false)
    setIsLoadingAuth(false)
    setAuthError(null)
  }, [])

  const value = useMemo(
    () => ({ isLoadingAuth, isLoadingPublicSettings, authError }),
    [isLoadingAuth, isLoadingPublicSettings, authError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
