import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClientInstance } from "@/lib/query-client"
import NavigationTracker from "@/lib/NavigationTracker"
import { pagesConfig } from "./pages.config"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import PageNotFound from "./lib/PageNotFound"
import { AuthProvider } from "@/lib/AuthContext"
import { useEffect, useState } from "react"

const { Pages, Layout, mainPage } = pagesConfig
const mainPageKey = mainPage ?? Object.keys(Pages)[0]
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        }
      />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
    const initial = saved ? saved === "dark" : prefersDark
    setIsDark(initial)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AppRoutes />
        </Router>
        <button
          type="button"
          onClick={() => setIsDark((prev) => !prev)}
          className="fixed bottom-6 right-6 z-50 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {isDark ? "Light mode" : "Dark mode"}
        </button>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
