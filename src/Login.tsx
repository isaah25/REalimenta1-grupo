import { FormEvent, useState } from "react"

type Props = {
  onLoginSuccess: (ra: string) => void
  onAdmin: () => void
}

export default function Login({ onLoginSuccess, onAdmin }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [ra, setRa] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError("")
    setMessage("")

    if (!ra.trim() || !password.trim() || (mode === "register" && !name.trim())) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(mode === "login" ? "/api/login" : "/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ra: ra.trim(),
          name: name.trim(),
          password,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível concluir a operação.")
      }

      if (mode === "register") {
        setMessage("Cadastro criado com sucesso. Você já pode acessar o sistema.")
      }

      onLoginSuccess(data.ra)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao conectar com a API.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F8F7] text-[#34423F] p-6 flex items-center justify-center font-body">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#DDE7E4] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#E1F1EC] border border-[#B9DED4] flex items-center justify-center text-2xl">↺</div>
          <h1 className="text-3xl font-display font-black">RE<span className="text-[#4A9C8B]">alimenta</span></h1>
          <p className="text-[#71817D] text-sm">
            {mode === "login"
              ? "Entre com seu RA e senha para consultar o cardápio e votar."
              : "Crie um acesso de demonstração para participar da votação."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-[#EEF4F2] rounded-xl p-1">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); setMessage("") }}
            className={`rounded-lg py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-[#34423F] shadow-sm" : "text-[#71817D]"}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(""); setMessage("") }}
            className={`rounded-lg py-2 text-sm font-semibold ${mode === "register" ? "bg-white text-[#34423F] shadow-sm" : "text-[#71817D]"}`}
          >
            Criar acesso
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#71817D] mb-2">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do estudante"
                className="w-full border border-[#DDE7E4] rounded-xl px-4 py-3 outline-none focus:border-[#63C7B2]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#71817D] mb-2">RA</label>
            <input
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              placeholder="Ex.: 123456"
              autoComplete="username"
              className="w-full border border-[#DDE7E4] rounded-xl px-4 py-3 outline-none focus:border-[#63C7B2]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#71817D] mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full border border-[#DDE7E4] rounded-xl px-4 py-3 outline-none focus:border-[#63C7B2]"
            />
          </div>

          {error && <div className="rounded-xl bg-[#FFF1F1] border border-[#E8C7C7] px-4 py-3 text-sm text-[#A95E5E]">{error}</div>}
          {message && <div className="rounded-xl bg-[#E8F4F0] border border-[#B9DED4] px-4 py-3 text-sm text-[#4A8F81]">{message}</div>}

          <button
            disabled={loading}
            className="w-full bg-[#63C7B2] hover:bg-[#52B9A4] text-[#17332D] font-bold py-3.5 rounded-xl disabled:opacity-50"
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar e votar" : "Cadastrar e entrar"}
          </button>
        </form>

        <div className="rounded-xl bg-[#F4F7F6] border border-[#DDE7E4] p-4 text-xs text-[#71817D] leading-relaxed">
          <strong>Aluno de demonstração:</strong> RA 123456 · senha 123456
        </div>

        <button
          type="button"
          onClick={onAdmin}
          className="w-full text-sm text-[#71817D] hover:text-[#34423F]"
        >
          Área administrativa →
        </button>
      </div>
    </div>
  )
}
