import { useEffect, useRef, useState } from "react"

type Vote = "yes" | "no" | null

type Meal = {
  id: number
  date: string
  name: string
  description: string | null
  icon: string
  created_at: string
}

const API_URL = ""

const TOTAL_STUDENTS = 312

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target <= 0) {
      setValue(0)
      return
    }

    let start = 0
    const step = target / (duration / 16)

    const timer = setInterval(() => {
      start += step

      if (start >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target, duration])

  return value
}

function StatCard({
  icon,
  value,
  label,
  sub,
  accent = "teal",
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  sub?: string
  accent?: "teal" | "amber" | "rose"
}) {
  const colors = {
    teal: "text-[#63C7B2]",
    amber: "text-[#D9A85C]",
    rose: "text-[#D97979]",
  }

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-2 transition-all duration-300 card-glow-teal group">
      <div
        className={`text-xl ${colors[accent]} opacity-80 group-hover:opacity-100 transition-opacity`}
      >
        {icon}
      </div>

      <div className={`font-display font-bold text-2xl ${colors[accent]}`}>
        {value}
      </div>

      <div className="text-sm font-semibold text-[#E2EAF4] leading-tight">
        {label}
      </div>

      {sub && <div className="text-xs text-[#8B9BB4]">{sub}</div>}
    </div>
  )
}

function VoteButton({
  type,
  selected,
  onClick,
  count,
  disabled,
}: {
  type: "yes" | "no"
  selected: boolean
  onClick: () => void
  count: number
  disabled: boolean
}) {
  const isYes = type === "yes"

  return (
    <button
      onClick={onClick}
      disabled={disabled && !selected}
      className={`btn-vote relative flex flex-col items-center gap-3 px-8 py-6 rounded-2xl font-display font-bold text-base transition-all duration-200
        ${
          selected
            ? isYes
              ? "bg-[#63C7B2] text-[#17332D] shadow-[0_0_30px_rgba(99,199,178,0.25)]"
              : "bg-[#D97979] text-white shadow-[0_0_30px_rgba(217,121,121,0.25)]"
            : `glass ${
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-opacity-30 cursor-pointer"
              } ${
                isYes ? "hover:border-[#63C7B2]" : "hover:border-[#D97979]"
              } border border-white/10`
        }
      `}
      style={{ minWidth: 160 }}
    >
      {selected && (
        <div
          className={`absolute inset-0 rounded-2xl animate-pulse-ring border-2 ${
            isYes ? "border-[#63C7B2]" : "border-[#D97979]"
          } pointer-events-none`}
        />
      )}

      <span className="text-3xl">{isYes ? "✓" : "✕"}</span>

      <span>{isYes ? "Vou consumir" : "Não vou consumir"}</span>

      <span
        className={`font-mono text-xs font-normal ${
          selected ? "opacity-70" : "text-[#8B9BB4]"
        }`}
      >
        {count} votos
      </span>
    </button>
  )
}

function ParticipationBar({
  yes,
  no,
  total,
}: {
  yes: number
  no: number
  total: number
}) {
  const pctYes = total > 0 ? (yes / total) * 100 : 0
  const pctNo = total > 0 ? (no / total) * 100 : 0
  const pctPending = Math.max(0, 100 - pctYes - pctNo)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-[#8B9BB4] mb-2">
        <span>PARTICIPAÇÃO</span>

        <span>
          {total} / {TOTAL_STUDENTS} alunos
        </span>
      </div>

      <div className="h-3 rounded-full overflow-hidden bg-[#DDE7E4] flex gap-0.5">
        <div
          className="h-full bg-[#63C7B2] rounded-l-full transition-all duration-1000 ease-out"
          style={{ width: `${pctYes}%` }}
        />

        <div
          className="h-full bg-[#D97979] transition-all duration-1000 ease-out"
          style={{ width: `${pctNo}%` }}
        />

        <div
          className="h-full bg-[#C7D4D1] rounded-r-full transition-all duration-1000 ease-out"
          style={{ width: `${pctPending}%` }}
        />
      </div>

      <div className="flex gap-5 text-xs flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#63C7B2]" />
          <span className="text-[#8B9BB4]">Vão consumir</span>
          <span className="font-mono text-[#4A8F81] font-medium">
            {pctYes.toFixed(0)}%
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D97979]" />
          <span className="text-[#8B9BB4]">Não vão</span>
          <span className="font-mono text-[#A95E5E] font-medium">
            {pctNo.toFixed(0)}%
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C7D4D1]" />
          <span className="text-[#8B9BB4]">Aguardando</span>
          <span className="font-mono text-[#8B9BB4] font-medium">
            {pctPending.toFixed(0)}%
          </span>
        </span>
      </div>
    </div>
  )
}

function WorldVisual() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <div className="w-56 h-56 md:w-64 md:h-64 animate-float">
          <div className="absolute inset-0 rounded-full bg-[#63C7B2]/5 border border-[#63C7B2]/10" />

          <div className="absolute inset-4 rounded-full bg-[#63C7B2]/8 border border-[#63C7B2]/15" />

          <div className="absolute inset-8 rounded-full bg-[#E7F0ED] border border-[#63C7B2]/30 flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full p-7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="#DCEBE6"
                stroke="#63C7B2"
                strokeWidth="3"
              />

              <path
                d="M42 82C55 69 68 75 78 66C88 57 94 41 108 45C121 49 118 65 130 70C143 75 159 66 165 81C170 94 157 101 150 111C143 121 151 135 139 144C126 153 115 140 103 146C91 152 82 162 69 155C56 148 61 132 51 123C41 114 34 96 42 82Z"
                fill="#63C7B2"
                opacity="0.8"
              />

              <path
                d="M74 46C82 53 82 62 75 68C68 73 60 69 57 61C54 54 62 46 74 46Z"
                fill="#A8D8CC"
              />

              <path
                d="M126 91C139 85 150 91 151 101C152 111 140 117 131 114C122 111 119 98 126 91Z"
                fill="#A8D8CC"
              />

              <path
                d="M76 119C86 114 97 120 96 130C95 140 84 145 76 140C68 135 68 124 76 119Z"
                fill="#A8D8CC"
              />

              <path
                d="M38 101C53 95 63 101 67 110"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />

              <path
                d="M109 38C121 43 131 50 137 59"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>

        <div className="absolute -top-2 -right-4 glass rounded-xl px-3 py-2 text-xs font-mono text-[#4A8F81] border border-[#63C7B2]/20">
          🌱 Sustentabilidade
        </div>

        <div className="absolute -bottom-2 -left-4 glass rounded-xl px-3 py-2 text-xs font-mono text-[#A77A39] border border-[#D9A85C]/20">
          🌎 Seja consciente
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({
  raUser,
}: {
  raUser: string
}) {
  const [vote, setVote] = useState<Vote>(null)
  const [yesCount, setYesCount] = useState(0)
  const [noCount, setNoCount] = useState(0)

  const [meal, setMeal] = useState<Meal | null>(null)
  const [loadingMeal, setLoadingMeal] = useState(true)
  const [loadingVotes, setLoadingVotes] = useState(true)
  const [sendingVote, setSendingVote] = useState(false)

  const [error, setError] = useState("")

  const confirmRef = useRef<HTMLDivElement>(null)

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const todayCapitalized =
    today.charAt(0).toUpperCase() + today.slice(1)

  // ----------------------------------------------------------
  // BUSCAR CARDÁPIO
  // ----------------------------------------------------------

  useEffect(() => {
    async function loadMeal() {
      try {
        setLoadingMeal(true)

        const response = await fetch(`${API_URL}/api/meals/today`)

        if (!response.ok) {
          throw new Error("Não foi possível buscar o cardápio.")
        }

        const data = await response.json()

        setMeal(data)
      } catch (err) {
        console.error(err)
        setError(
          "Não foi possível conectar ao servidor. Verifique se o backend está funcionando.",
        )
      } finally {
        setLoadingMeal(false)
      }
    }

    loadMeal()
  }, [])

  // ----------------------------------------------------------
  // BUSCAR VOTOS
  // ----------------------------------------------------------

  useEffect(() => {
    async function loadVotes() {
      try {
        setLoadingVotes(true)

        const response = await fetch(`${API_URL}/api/votes/today`)

        if (!response.ok) {
          throw new Error("Não foi possível buscar os votos.")
        }

        const data = await response.json()

        const values = Object.values(data) as string[]

        const yes = values.filter((item) => item === "yes").length
        const no = values.filter((item) => item === "no").length

        setYesCount(yes)
        setNoCount(no)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingVotes(false)
      }
    }

    loadVotes()
  }, [])

  // ----------------------------------------------------------
  // VOTAÇÃO
  // ----------------------------------------------------------

  async function handleVote(type: "yes" | "no") {
    if (vote !== null || sendingVote) return

    /*
     * Para registrar o voto, precisamos saber quem é o aluno.
     *
     * Por enquanto usamos o RA salvo no navegador.
     * Quando fizermos a tela de login, o RA será salvo automaticamente.
     */

    const ra = raUser

    try {
      setSendingVote(true)
      setError("")

      const response = await fetch(`${API_URL}/api/votar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ra,
          vote: type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível registrar o voto.")
      }

      setVote(type)

      if (type === "yes") {
        setYesCount((current) => current + 1)
      } else {
        setNoCount((current) => current + 1)
      }

      setTimeout(() => {
        confirmRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }, 100)
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível registrar seu voto.",
      )
    } finally {
      setSendingVote(false)
    }
  }

  const totalVoted = yesCount + noCount

  const participation =
    TOTAL_STUDENTS > 0
      ? Math.round((totalVoted / TOTAL_STUDENTS) * 100)
      : 0

  const estimatedPortions = yesCount

  const animatedVotes = useCountUp(totalVoted)

  return (
    <div className="min-h-screen bg-[#F5F8F7] text-[#34423F] font-display">
      {/* Fundo */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,199,178,0.08),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(217,168,92,0.07),transparent_30%)]" />
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#DDE7E4]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E1F1EC] border border-[#B9DED4] flex items-center justify-center">
              <span className="text-[#4A8F81] text-lg">↺</span>
            </div>

            <span className="font-display font-bold text-base tracking-tight text-[#34423F]">
              REalimenta
            </span>

            <span className="hidden sm:block text-[10px] font-mono uppercase tracking-widest text-[#8B9BB4] border border-[#DDE7E4] rounded px-2 py-0.5">
              Projeto Escolar
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#E8F4F0] border border-[#C9E6DE] rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63C7B2] animate-pulse" />

            <span className="text-xs font-mono text-[#4A8F81]">
              {loadingVotes ? "Carregando..." : `${animatedVotes} votos hoje`}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 relative">
        {/* HERO */}
        <section className="grid md:grid-cols-2 gap-8 items-center min-h-[45vh] py-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4A8F81] border border-[#C9E6DE] bg-[#E8F4F0] rounded-full px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63C7B2]" />
              Alimentação consciente
            </div>

            <h1 className="font-display font-black text-4xl md:text-6xl leading-[1.05] text-[#34423F]">
              Seu voto ajuda a
              <br />
              <span className="text-[#4A9C8B]">evitar desperdícios.</span>
            </h1>

            <p className="text-[#71817D] text-base leading-relaxed max-w-md font-body">
              Consulte o cardápio da escola e informe se pretende consumir a
              refeição. Sua participação ajuda a escola a planejar melhor.
            </p>

            <div className="flex gap-4 text-sm flex-wrap">
              <div className="border-l-2 border-[#63C7B2] pl-3">
                <div className="font-mono font-bold text-[#34423F]">
                  {TOTAL_STUDENTS}
                </div>

                <div className="text-[#8B9BB4] text-xs">
                  alunos na escola
                </div>
              </div>

              <div className="border-l-2 border-[#D9A85C] pl-3">
                <div className="font-mono font-bold text-[#34423F]">
                  {totalVoted}
                </div>

                <div className="text-[#8B9BB4] text-xs">
                  já votaram hoje
                </div>
              </div>

              <div className="border-l-2 border-[#C7D4D1] pl-3">
                <div className="font-mono font-bold text-[#34423F]">
                  {Math.max(0, TOTAL_STUDENTS - totalVoted)}
                </div>

                <div className="text-[#8B9BB4] text-xs">
                  aguardando
                </div>
              </div>
            </div>
          </div>

          <WorldVisual />
        </section>

        {/* ERRO */}
        {error && (
          <div className="bg-[#FFF4F4] border border-[#E8C7C7] text-[#9A5C5C] rounded-2xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* CARDÁPIO + VOTAÇÃO */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl p-8 space-y-6 border border-[#DDE7E4] shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
                  {todayCapitalized}
                </div>

                <h2 className="font-display font-black text-2xl md:text-3xl text-[#34423F]">
                  Cardápio de hoje
                </h2>
              </div>

              <div className="bg-[#FFF6E6] rounded-xl px-3 py-2 text-xs font-mono text-[#A77A39] border border-[#EBD8B7]">
                Jantar 19:50
              </div>
            </div>

            {loadingMeal ? (
              <div className="py-12 text-center text-[#8B9BB4]">
                Carregando cardápio...
              </div>
            ) : meal ? (
              <>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#EDF4F1] border border-[#DDE7E4] flex items-center justify-center text-5xl shrink-0">
                    {meal.icon || "🍽️"}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-[#34423F]">
                      {meal.name}
                    </h3>

                    <p className="text-[#71817D] text-sm mt-1 leading-relaxed font-body">
                      {meal.description || "Refeição preparada pela escola."}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F4F8F6] rounded-2xl p-4 border border-[#E1EAE7]">
                  <div className="flex items-center gap-2 text-sm text-[#71817D]">
                    <span>🌱</span>
                    <span>
                      Informe sua intenção de consumo para ajudar no
                      planejamento da escola.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  {!vote ? (
                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-4">
                        Você vai consumir essa refeição?
                      </div>

                      <div className="flex gap-4 flex-wrap">
                        <VoteButton
                          type="yes"
                          selected={false}
                          onClick={() => handleVote("yes")}
                          count={yesCount}
                          disabled={sendingVote}
                        />

                        <VoteButton
                          type="no"
                          selected={false}
                          onClick={() => handleVote("no")}
                          count={noCount}
                          disabled={sendingVote}
                        />
                      </div>
                    </div>
                  ) : (
                    <div ref={confirmRef} className="animate-count-up">
                      <div
                        className={`rounded-2xl p-5 border ${
                          vote === "yes"
                            ? "bg-[#E8F4F0] border-[#B9DED4]"
                            : "bg-[#FFF1F1] border-[#E8C7C7]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                              vote === "yes"
                                ? "bg-[#D5EEE7] text-[#4A8F81]"
                                : "bg-[#F5DADA] text-[#A95E5E]"
                            }`}
                          >
                            {vote === "yes" ? "✓" : "✕"}
                          </div>

                          <div>
                            <div className="font-display font-bold text-[#34423F]">
                              Voto registrado!
                            </div>

                            <div
                              className="text-sm font-body mt-0.5"
                              style={{
                                color:
                                  vote === "yes"
                                    ? "#4A8F81"
                                    : "#A95E5E",
                              }}
                            >
                              {vote === "yes"
                                ? "Você informou que pretende consumir hoje."
                                : "Seu voto ajuda a escola a planejar melhor."}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-4">
                        <VoteButton
                          type="yes"
                          selected={vote === "yes"}
                          onClick={() => {}}
                          count={yesCount}
                          disabled={true}
                        />

                        <VoteButton
                          type="no"
                          selected={vote === "no"}
                          onClick={() => {}}
                          count={noCount}
                          disabled={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="text-4xl mb-3">🍽️</div>

                <h3 className="font-display font-bold text-lg text-[#34423F]">
                  Nenhum cardápio cadastrado para hoje
                </h3>

                <p className="text-sm text-[#8B9BB4] mt-2">
                  O cardápio ainda não foi publicado pela escola.
                </p>
              </div>
            )}
          </div>

          {/* PARTICIPAÇÃO */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 space-y-5 border border-[#DDE7E4] shadow-sm">
              <div className="text-xs font-mono uppercase tracking-widest text-[#8B9BB4]">
                Participação hoje
              </div>

              <div className="flex justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#E3EBE8"
                      strokeWidth="8"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#63C7B2"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(totalVoted / TOTAL_STUDENTS) * 251.2} 251.2`}
                      className="transition-all duration-1000"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-black text-2xl text-[#34423F]">
                      {participation}%
                    </span>

                    <span className="text-[10px] font-mono text-[#8B9BB4]">
                      votaram
                    </span>
                  </div>
                </div>
              </div>

              <ParticipationBar
                yes={yesCount}
                no={noCount}
                total={TOTAL_STUDENTS}
              />
            </div>

            {/* ESTIMATIVA */}
            <div className="bg-white rounded-3xl p-6 border border-[#EBD8B7] space-y-3 shadow-sm">
              <div className="text-xs font-mono uppercase tracking-widest text-[#8B9BB4]">
                Planejamento
              </div>

              <div className="font-display font-black text-3xl text-[#34423F]">
                {estimatedPortions}{" "}
                <span className="text-base font-normal text-[#8B9BB4]">
                  pessoas pretendem consumir
                </span>
              </div>

              <div className="text-xs font-body text-[#8B9BB4] leading-relaxed">
                A quantidade é baseada nos votos registrados até o momento.
              </div>

              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#D9A85C] animate-pulse" />

                <span className="text-xs font-mono text-[#A77A39]">
                  Atualizado pelos votos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="space-y-6">
          <div className="text-center">
            <div className="text-xs font-mono uppercase tracking-widest text-[#8B9BB4] mb-2">
              Como funciona
            </div>

            <h2 className="font-display font-black text-2xl md:text-3xl text-[#34423F]">
              Simples, rápido e{" "}
              <span className="text-[#4A9C8B]">consciente</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                icon: "👀",
                title: "Consulte o cardápio",
                desc: "Veja qual será a refeição servida na escola.",
                color: "#63C7B2",
              },
              {
                step: "02",
                icon: "🗳️",
                title: "Vote com um clique",
                desc: "Informe se pretende consumir ou não a refeição.",
                color: "#D9A85C",
              },
              {
                step: "03",
                icon: "🌱",
                title: "Ajude no planejamento",
                desc: "Os votos ajudam a escola a entender a demanda.",
                color: "#63C7B2",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-6 border border-[#DDE7E4] hover:border-[#C3DCD5] transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>

                  <span className="font-mono text-xs text-[#C7D4D1] group-hover:text-[#8B9BB4] transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="font-display font-bold text-lg text-[#34423F] mb-2">
                  {item.title}
                </div>

                <p className="text-sm text-[#71817D] leading-relaxed font-body">
                  {item.desc}
                </p>

                <div
                  className="mt-4 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#DDE7E4] pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#E1F1EC] border border-[#C9E6DE] flex items-center justify-center">
              <span className="text-[#4A8F81] text-xs">↺</span>
            </div>

            <span className="font-display font-semibold text-sm text-[#34423F]">
              REalimenta
            </span>

            <span className="text-[#8B9BB4] text-xs font-body">
              Projeto Multidisciplinar Escolar · 2026
            </span>
          </div>

          <div className="flex gap-6 text-xs font-mono text-[#8B9BB4]">
            <span>Sustentabilidade</span>
            <span>·</span>
            <span>Educação</span>
            <span>·</span>
            <span>Consciência</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
