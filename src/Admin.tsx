import { FormEvent, useEffect, useState } from "react"

const API_URL = ""

type Meal = {
  id: number
  date: string
  name: string
  description: string
  protein: number
  carbohydrates: number
  calories: number
  icon: string
  created_at?: string
}

type Admin = {
  id: number
  username: string
  name: string
}

type Props = {
  onBack: () => void
}

const emptyForm = {
  date: "",
  name: "",
  description: "",
  protein: "",
  carbohydrates: "",
  calories: "",
  icon: "🍽️",
}

export default function Admin({ onBack }: Props) {
  const [admin, setAdmin] = useState<Admin | null>(null)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [loginError, setLoginError] = useState("")
  const [loadingLogin, setLoadingLogin] = useState(false)

  const [meals, setMeals] = useState<Meal[]>([])
  const [loadingMeals, setLoadingMeals] = useState(false)

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  // ==========================================================
  // LOGIN
  // ==========================================================

  async function handleLogin(event: FormEvent) {
    event.preventDefault()

    setLoginError("")
    setLoadingLogin(true)

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível fazer login.")
      }

      setAdmin(data.admin)

      setUsername("")
      setPassword("")
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "Erro ao fazer login.",
      )
    } finally {
      setLoadingLogin(false)
    }
  }

  // ==========================================================
  // BUSCAR CARDÁPIOS
  // ==========================================================

  async function loadMeals() {
    setLoadingMeals(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/api/meals`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar cardápios.")
      }

      setMeals(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os cardápios.",
      )
    } finally {
      setLoadingMeals(false)
    }
  }

  useEffect(() => {
    if (admin) {
      loadMeals()
    }
  }, [admin])

  // ==========================================================
  // FORMULÁRIO
  // ==========================================================

  function updateForm(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setMessage("")
    setError("")
  }

  function editMeal(meal: Meal) {
    setEditingId(meal.id)

    setForm({
      date: meal.date,
      name: meal.name,
      description: meal.description || "",
      protein: String(meal.protein ?? ""),
      carbohydrates: String(meal.carbohydrates ?? ""),
      calories: String(meal.calories ?? ""),
      icon: meal.icon || "🍽️",
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ==========================================================
  // SALVAR CARDÁPIO
  // ==========================================================

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    setMessage("")
    setError("")

    if (!form.date || !form.name.trim()) {
      setError("Preencha a data e o nome da refeição.")
      return
    }

    setSaving(true)

    const body = {
      date: form.date,
      name: form.name.trim(),
      description: form.description.trim(),
      protein: Number(form.protein) || 0,
      carbohydrates: Number(form.carbohydrates) || 0,
      calories: Number(form.calories) || 0,
      icon: form.icon || "🍽️",
    }

    try {
      const url = editingId
        ? `${API_URL}/api/meals/${editingId}`
        : `${API_URL}/api/meals`

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível salvar o cardápio.")
      }

      setMessage(
        editingId
          ? "Cardápio atualizado com sucesso!"
          : "Cardápio cadastrado com sucesso!",
      )

      resetForm()
      await loadMeals()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar cardápio.",
      )
    } finally {
      setSaving(false)
    }
  }

  // ==========================================================
  // EXCLUIR CARDÁPIO
  // ==========================================================

  async function deleteMeal(id: number) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este cardápio?",
    )

    if (!confirmed) return

    setMessage("")
    setError("")

    try {
      const response = await fetch(`${API_URL}/api/meals/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível excluir.")
      }

      setMessage("Cardápio excluído com sucesso!")

      if (editingId === id) {
        resetForm()
      }

      await loadMeals()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao excluir cardápio.",
      )
    }
  }

  // ==========================================================
  // FORMATAR DATA
  // ==========================================================

  function formatDate(date: string) {
    const [year, month, day] = date.split("-")

    if (!year || !month || !day) {
      return date
    }

    return `${day}/${month}/${year}`
  }

  // ==========================================================
  // TELA DE LOGIN
  // ==========================================================

  if (!admin) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-[#E2EAF4] font-display relative overflow-hidden">
        <div className="fixed inset-0 grid-dots opacity-50 pointer-events-none" />

        <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#00E5B4]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
          <div className="w-full max-w-md">
            <button
              onClick={onBack}
              className="text-sm text-[#8B9BB4] hover:text-white transition-colors mb-6"
            >
              ← Voltar para o site
            </button>

            <div className="glass rounded-3xl p-8 border border-[#00E5B4]/10">
              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-[#00E5B4]/10 border border-[#00E5B4]/20 flex items-center justify-center text-2xl mb-4">
                  🔐
                </div>

                <div className="text-xs font-mono uppercase tracking-widest text-[#00E5B4] mb-2">
                  Área restrita
                </div>

                <h1 className="font-display font-black text-3xl text-white">
                  Painel do ADM
                </h1>

                <p className="text-[#8B9BB4] text-sm mt-2">
                  Entre para gerenciar os cardápios.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                    Usuário
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Digite o usuário"
                    autoComplete="username"
                    className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                    Senha
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Digite a senha"
                    autoComplete="current-password"
                    className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50 transition-colors"
                  />
                </div>

                {loginError && (
                  <div className="rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 px-4 py-3 text-sm text-[#FF6B6B]">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingLogin}
                  className="w-full bg-[#00E5B4] hover:bg-[#00C49A] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B1220] font-display font-bold rounded-xl py-3 transition-all hover:shadow-[0_0_30px_rgba(0,229,180,0.25)]"
                >
                  {loadingLogin ? "Entrando..." : "Entrar no painel"}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <span className="text-[11px] font-mono text-[#4A5568]">
                  NãoDesperdice · Área administrativa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================================
  // PAINEL DO ADM
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E2EAF4] font-display relative">
      <div className="fixed inset-0 grid-dots opacity-50 pointer-events-none" />

      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#00E5B4]/5 rounded-full blur-[120px] pointer-events-none" />

      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E5B4]/10 border border-[#00E5B4]/30 flex items-center justify-center">
              <span className="text-[#00E5B4]">⚙</span>
            </div>

            <span className="font-display font-bold text-base text-white">
              NãoDesperdice
            </span>

            <span className="hidden sm:block text-[10px] font-mono uppercase tracking-widest text-[#00E5B4] border border-[#00E5B4]/20 rounded px-2 py-0.5">
              ADM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-[#8B9BB4]">
              Olá, {admin.name}
            </span>

            <button
              onClick={onBack}
              className="text-xs font-mono text-[#8B9BB4] hover:text-white border border-white/10 rounded-lg px-3 py-2 transition-colors"
            >
              Voltar ao site
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 relative space-y-8">
        <section>
          <div className="text-xs font-mono uppercase tracking-widest text-[#00E5B4] mb-2">
            Administração
          </div>

          <h1 className="font-display font-black text-4xl text-white">
            Gerenciar cardápio
          </h1>

          <p className="text-[#8B9BB4] mt-2">
            Cadastre e atualize as refeições que aparecerão para os alunos.
          </p>
        </section>

        {/* MENSAGENS */}

        {message && (
          <div className="rounded-2xl bg-[#00E5B4]/10 border border-[#00E5B4]/20 px-5 py-4 text-sm text-[#00E5B4]">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 px-5 py-4 text-sm text-[#FF6B6B]">
            {error}
          </div>
        )}

        {/* FORMULÁRIO */}

        <section className="glass rounded-3xl p-6 md:p-8 border border-[#00E5B4]/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-1">
                {editingId ? "Editar" : "Novo"}
              </div>

              <h2 className="font-display font-bold text-2xl text-white">
                {editingId ? "Editar cardápio" : "Adicionar cardápio"}
              </h2>
            </div>

            {editingId && (
              <button
                onClick={resetForm}
                className="text-xs font-mono text-[#8B9BB4] hover:text-white border border-white/10 rounded-lg px-3 py-2"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                  Data
                </label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    updateForm("date", event.target.value)
                  }
                  className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                  Emoji
                </label>

                <input
                  type="text"
                  value={form.icon}
                  onChange={(event) =>
                    updateForm("icon", event.target.value)
                  }
                  placeholder="🍽️"
                  className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                Nome da refeição
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Ex.: Arroz, Feijão e Carne Suína"
                className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                Descrição
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                placeholder="Descreva os alimentos da refeição..."
                rows={3}
                className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                  Proteína (g)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.protein}
                  onChange={(event) =>
                    updateForm("protein", event.target.value)
                  }
                  placeholder="15"
                  className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                  Carboidratos (g)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.carbohydrates}
                  onChange={(event) =>
                    updateForm("carbohydrates", event.target.value)
                  }
                  placeholder="30"
                  className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                  Calorias (kcal)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.calories}
                  onChange={(event) =>
                    updateForm("calories", event.target.value)
                  }
                  placeholder="170"
                  className="w-full bg-[#1A2744] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00E5B4]/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto bg-[#00E5B4] hover:bg-[#00C49A] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B1220] font-display font-bold rounded-xl px-8 py-3 transition-all hover:shadow-[0_0_30px_rgba(0,229,180,0.25)]"
            >
              {saving
                ? "Salvando..."
                : editingId
                  ? "Salvar alterações"
                  : "Cadastrar cardápio"}
            </button>
          </form>
        </section>

        {/* LISTA DE CARDÁPIOS */}

        <section className="glass rounded-3xl p-6 md:p-8 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-1">
                Banco de dados
              </div>

              <h2 className="font-display font-bold text-2xl text-white">
                Cardápios cadastrados
              </h2>
            </div>

            <button
              onClick={loadMeals}
              disabled={loadingMeals}
              className="text-xs font-mono text-[#8B9BB4] hover:text-[#00E5B4] transition-colors"
            >
              {loadingMeals ? "Atualizando..." : "↻ Atualizar"}
            </button>
          </div>

          {loadingMeals ? (
            <div className="text-center py-10 text-[#8B9BB4]">
              Carregando cardápios...
            </div>
          ) : meals.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
              <div className="text-3xl mb-3">🍽️</div>

              <div className="font-display font-bold text-white">
                Nenhum cardápio cadastrado
              </div>

              <p className="text-sm text-[#8B9BB4] mt-1">
                Use o formulário acima para adicionar a primeira refeição.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-[#1A2744]/70 border border-white/5 rounded-2xl p-4 md:p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#243356] flex items-center justify-center text-3xl shrink-0">
                      {meal.icon || "🍽️"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[#00E5B4]">
                          {formatDate(meal.date)}
                        </span>

                        {meal.date ===
                          new Date().toISOString().split("T")[0] && (
                          <span className="text-[10px] font-mono uppercase bg-[#00E5B4]/10 text-[#00E5B4] px-2 py-0.5 rounded-full">
                            Hoje
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-lg text-white">
                        {meal.name}
                      </h3>

                      {meal.description && (
                        <p className="text-sm text-[#8B9BB4] mt-1">
                          {meal.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-[10px] font-mono bg-[#243356] text-[#8B9BB4] px-2 py-1 rounded-full">
                          Proteína: {meal.protein}g
                        </span>

                        <span className="text-[10px] font-mono bg-[#243356] text-[#8B9BB4] px-2 py-1 rounded-full">
                          Carboidratos: {meal.carbohydrates}g
                        </span>

                        <span className="text-[10px] font-mono bg-[#243356] text-[#8B9BB4] px-2 py-1 rounded-full">
                          {meal.calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => editMeal(meal)}
                        className="px-4 py-2 rounded-xl bg-[#FFB830]/10 border border-[#FFB830]/20 text-[#FFB830] text-xs font-mono hover:bg-[#FFB830]/20 transition-colors"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => deleteMeal(meal.id)}
                        className="px-4 py-2 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] text-xs font-mono hover:bg-[#FF6B6B]/20 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

