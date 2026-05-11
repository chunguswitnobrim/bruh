export default function IdleCasino() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-900 via-red-950 to-black text-white p-6 font-sans overflow-hidden">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        @keyframes glow {
          0% { box-shadow: 0 0 10px #facc15; }
          50% { box-shadow: 0 0 25px #facc15; }
          100% { box-shadow: 0 0 10px #facc15; }
        }

        .floaty {
          animation: float 2s ease-in-out infinite;
        }

        .glow {
          animation: glow 1.5s infinite;
        }
      `}</style>

      <CasinoGame />
    </div>
  )
}

import { useEffect, useState } from 'react'

function CasinoGame() {
  const [chips, setChips] = useState(0)
  const [perClick, setPerClick] = useState(1)
  const [autoIncome, setAutoIncome] = useState(0)
  const [plinkoBalls, setPlinkoBalls] = useState([])

  const upgrades = [
    {
      name: 'Suspicious Grandma',
      cost: 25,
      gain: 1,
      desc: 'Sneaks around the casino collecting loose chips.'
    },
    {
      name: 'Lucky Hamster',
      cost: 100,
      gain: 5,
      desc: 'Tiny tuxedo hamster improves casino vibes.'
    },
    {
      name: 'Rigged Slot Machine',
      cost: 350,
      gain: 15,
      desc: 'Definitely legal.'
    },
    {
      name: 'Golden Toilet VIP Room',
      cost: 1000,
      gain: 40,
      desc: 'Rich people love shiny bathrooms.'
    }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('idleCasinoSave')
    if (saved) {
      const data = JSON.parse(saved)
      setChips(data.chips || 0)
      setPerClick(data.perClick || 1)
      setAutoIncome(data.autoIncome || 0)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'idleCasinoSave',
      JSON.stringify({ chips, perClick, autoIncome })
    )
  }, [chips, perClick, autoIncome])

  useEffect(() => {
    const interval = setInterval(() => {
      setChips(prev => prev + autoIncome)
    }, 1000)

    return () => clearInterval(interval)
  }, [autoIncome])

  function clickCasino() {
    setChips(prev => prev + perClick)
  }

  function buyUpgrade(upgrade) {
    if (chips >= upgrade.cost) {
      setChips(prev => prev - upgrade.cost)
      setAutoIncome(prev => prev + upgrade.gain)
    }
  }

  function upgradeClicker() {
    if (chips >= 50) {
      setChips(prev => prev - 50)
      setPerClick(prev => prev + 1)
    }
  }

  function dropPlinko() {
    if (chips < 10) return

    setChips(prev => prev - 10)

    const id = Date.now()
    const x = Math.random() * 80 + 10

    setPlinkoBalls(prev => [...prev, { id, x }])

    setTimeout(() => {
      const rewards = [0, 5, 10, 25, 50, 100]
      const reward = rewards[Math.floor(Math.random() * rewards.length)]
      setChips(prev => prev + reward)
      setPlinkoBalls(prev => prev.filter(ball => ball.id !== id))
    }, 1800)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-black/40 rounded-3xl p-6 border-4 border-yellow-400 shadow-2xl">
        <h1 className="text-5xl font-black text-yellow-300 text-center mb-2 tracking-wider">
          IDLE CASINO
        </h1>

        <p className="text-center text-red-200 mb-6">
          Totally legal gambling empire simulator.
        </p>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-green-300">
            {Math.floor(chips).toLocaleString()} Chips
          </div>

          <div className="text-yellow-200 mt-2">
            +{perClick} per click • +{autoIncome}/sec
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={clickCasino}
            className="glow floaty w-64 h-64 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 text-black text-3xl font-black border-8 border-yellow-100 hover:scale-105 active:scale-95 transition-all"
          >
            SPIN
          </button>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={upgradeClicker}
            className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-bold text-lg"
          >
            Upgrade Click (+1) • 50 Chips
          </button>
        </div>

        <div className="bg-red-950/70 rounded-2xl p-5 border-2 border-yellow-400">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-3xl font-bold text-yellow-300">PLINKO</h2>

            <button
              onClick={dropPlinko}
              className="bg-yellow-300 hover:bg-yellow-200 text-black px-5 py-2 rounded-xl font-bold"
            >
              Drop Ball (10 Chips)
            </button>
          </div>

          <div className="relative h-96 bg-black rounded-xl overflow-hidden border border-yellow-500">
            {[...Array(8)].map((_, row) => (
              <div
                key={row}
                className="absolute w-full flex justify-center gap-8"
                style={{ top: `${40 + row * 35}px` }}
              >
                {[...Array(8)].map((_, peg) => (
                  <div
                    key={peg}
                    className="w-3 h-3 bg-yellow-300 rounded-full"
                  />
                ))}
              </div>
            ))}

            {plinkoBalls.map(ball => (
              <div
                key={ball.id}
                className="absolute w-5 h-5 bg-red-400 rounded-full"
                style={{
                  left: `${ball.x}%`,
                  top: '10px',
                  animation: 'float 0.5s infinite'
                }}
              />
            ))}

            <div className="absolute bottom-0 w-full grid grid-cols-6 text-center text-black font-bold">
              <div className="bg-red-500 py-2">0</div>
              <div className="bg-orange-400 py-2">5</div>
              <div className="bg-yellow-300 py-2">10</div>
              <div className="bg-green-300 py-2">25</div>
              <div className="bg-cyan-300 py-2">50</div>
              <div className="bg-pink-400 py-2">100</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 rounded-3xl p-5 border-4 border-red-400 shadow-2xl">
        <h2 className="text-3xl font-black text-yellow-300 mb-4 text-center">
          UPGRADES
        </h2>

        <div className="space-y-4">
          {upgrades.map(upgrade => (
            <button
              key={upgrade.name}
              onClick={() => buyUpgrade(upgrade)}
              className="w-full text-left bg-red-950 hover:bg-red-900 border-2 border-yellow-500 rounded-2xl p-4 transition-all hover:scale-[1.02]"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-black text-yellow-200 text-lg">
                  {upgrade.name}
                </div>

                <div className="text-green-300 font-bold">
                  {upgrade.cost}
                </div>
              </div>

              <div className="text-sm text-red-100 mb-2">
                {upgrade.desc}
              </div>

              <div className="text-yellow-300 font-semibold">
                +{upgrade.gain} chips/sec
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 bg-yellow-300 text-black rounded-2xl p-4 text-center font-bold">
          Tip: The casino always wins.
        </div>
      </div>
    </div>
  )
}
