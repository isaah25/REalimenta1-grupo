import { useState } from "react"
import Admin from "./Admin"
import Dashboard from "./Dashboard"
import Login from "./Login"

type View = "login" | "student" | "admin"

export default function App() {
  const [ra, setRa] = useState<string>(() => localStorage.getItem("reAlimenta_ra") || "")
  const [view, setView] = useState<View>(() =>
    localStorage.getItem("reAlimenta_ra") ? "student" : "login",
  )

  function handleLogin(raUser: string) {
    localStorage.setItem("reAlimenta_ra", raUser)
    setRa(raUser)
    setView("student")
  }

  function logout() {
    localStorage.removeItem("reAlimenta_ra")
    setRa("")
    setView("login")
  }

  if (view === "admin") {
    return <Admin onBack={() => setView(ra ? "student" : "login")} />
  }

  if (!ra || view === "login") {
    return <Login onLoginSuccess={handleLogin} onAdmin={() => setView("admin")} />
  }

  return (
    <div className="relative">
      <div className="fixed right-4 top-20 z-[70] flex gap-2">
        <button
          onClick={() => setView("admin")}
          className="bg-white/90 backdrop-blur border border-[#DDE7E4] text-[#4A8F81] text-xs font-semibold px-3 py-2 rounded-xl shadow-sm"
        >
          ADM
        </button>
        <button
          onClick={logout}
          className="bg-white/90 backdrop-blur border border-[#DDE7E4] text-[#A95E5E] text-xs font-semibold px-3 py-2 rounded-xl shadow-sm"
        >
          Sair ({ra})
        </button>
      </div>
      <Dashboard raUser={ra} />
    </div>
  )
}
