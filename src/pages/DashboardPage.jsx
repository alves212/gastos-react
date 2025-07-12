import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const [items, setItems] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [balance, setBalance] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [sortMode, setSortMode] = useState('original')
  const [originalOrder, setOriginalOrder] = useState([])
  const [filterState, setFilterState] = useState(0)

  const navigate = useNavigate()
  const user = auth.currentUser

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      const userDoc = doc(db, 'financeData', user.uid)
      const snapshot = await getDoc(userDoc)
      if (snapshot.exists()) {
        const data = snapshot.data().items || []
        setItems(data)
        setOriginalOrder(data)
      }
    }

    fetchData()
  }, [user, navigate])

  useEffect(() => {
    let income = 0
    let expense = 0

    items.forEach((item) => {
      const value = parseFloat(item.amount) || 0
      if (item.sign === '+') income += value
      else if (item.sign === '-') expense += value
    })

    setTotalIncome(income)
    setTotalExpenses(expense)
    setBalance(income - expense)
  }, [items])

  const saveToFirestore = async (updatedItems) => {
    if (!user) return
    const userDoc = doc(db, 'financeData', user.uid)
    await setDoc(userDoc, { items: updatedItems })
  }

  const handleChange = (index, field, value) => {
    const updated = [...items]
    if (field === 'checked') {
      updated[index][field] = !updated[index][field]
    } else if (field === 'amount') {
      updated[index][field] = parseFloat(value) || 0
    } else {
      updated[index][field] = value
    }
    setItems(updated)
    saveToFirestore(updated)
  }

  const addItem = (sign) => {
    const updated = [
      ...items,
      { description: '', amount: 0, sign, checked: false },
    ]
    setItems(updated)
    setOriginalOrder(updated)
    saveToFirestore(updated)
  }

  const removeItem = (index) => {
    const updated = [...items]
    updated.splice(index, 1)
    setItems(updated)
    setOriginalOrder(updated)
    saveToFirestore(updated)
  }

  const moveRowUp = () => {
    if (selectedIndex === null || selectedIndex === 0) return
    const updated = [...items]
    const temp = updated[selectedIndex]
    updated[selectedIndex] = updated[selectedIndex - 1]
    updated[selectedIndex - 1] = temp
    setItems(updated)
    setSelectedIndex(selectedIndex - 1)
    saveToFirestore(updated)
  }

  const moveRowDown = () => {
    if (selectedIndex === null || selectedIndex === items.length - 1) return
    const updated = [...items]
    const temp = updated[selectedIndex]
    updated[selectedIndex] = updated[selectedIndex + 1]
    updated[selectedIndex + 1] = temp
    setItems(updated)
    setSelectedIndex(selectedIndex + 1)
    saveToFirestore(updated)
  }

  const toggleSort = () => {
    if (sortMode === 'original') {
      setItems([...items].sort((a, b) => a.amount - b.amount))
      setSortMode('asc')
    } else if (sortMode === 'asc') {
      setItems([...items].sort((a, b) => b.amount - a.amount))
      setSortMode('desc')
    } else {
      setItems(originalOrder)
      setSortMode('original')
    }
  }

  const toggleFilter = () => {
    setFilterState((prev) => (prev + 1) % 3)
  }

  const filteredItems = items.filter((item) => {
    if (filterState === 1) return item.checked
    if (filterState === 2) return !item.checked
    return true
  })

  const logout = () => {
    auth.signOut().then(() => navigate('/'))
  }

  return (
    <div className="relative min-h-screen bg-black text-white p-6 overflow-hidden">
      {/* 🔥 Vídeo de fundo com efeito de entrada */}
      <video
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-50 animate-fadeout pointer-events-none"
      >
        <source src="/video.webm" type="video/webm" />
      </video>

      {/* 🔲 Escurecimento opcional */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10 pointer-events-none"></div>

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/fundoLogin.webm" type="video/webm" />
      </video>

      {/* 🔤 Conteúdo principal */}
      <div className="relative z-20">
        <h1 className="text-3xl font-bold mb-4 text-center">GASTOS</h1>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => addItem('+')}
            className="bg-green-600 px-5 py-2 rounded hover:bg-green-700"
          >
            +
          </button>
          <button
            onClick={() => addItem('-')}
            className="bg-red-600 px-5 py-2 rounded hover:bg-red-700"
          >
            -
          </button>
          <button
            onClick={moveRowUp}
            className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700"
          >
            ⬆️
          </button>
          <button
            onClick={moveRowDown}
            className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700"
          >
            ⬇️
          </button>
          <button
            onClick={toggleSort}
            className="bg-yellow-600 px-3 py-2 rounded hover:bg-yellow-700"
          >
            {sortMode === 'original' ? '🔄' : sortMode === 'asc' ? '⬆️' : '⬇️'}
          </button>
          <button
            onClick={toggleFilter}
            className="bg-purple-600 px-3 py-2 rounded hover:bg-purple-700"
          >
            {filterState === 0 ? '📋' : filterState === 1 ? '🟦' : '⬜'}
          </button>
          <button
            onClick={logout}
            className="ml-auto bg-gray-600 px-2 py-2 rounded hover:bg-gray-700"
          >
            Sair
          </button>
        </div>

        <table className="w-full text-left border-separate border-spacing-y-2 border-spacing-x-1">
          <thead>
            <tr>
              <th></th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Valor (R$)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, idx) => {
              const realIndex = items.indexOf(item)
              return (
                <tr
                  key={realIndex}
                  onClick={() => setSelectedIndex(realIndex)}
                  className={`${
                    item.sign === '+' ? 'bg-green-900' : 'bg-red-900'
                  } ${
                    selectedIndex === realIndex
                      ? 'outline outline-2 outline-yellow-400'
                      : ''
                  } py-2`}
                >
                  <td className="px-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-blue-900 cursor-pointer"
                      checked={item.checked || false}
                      onChange={() => handleChange(realIndex, 'checked')}
                    />
                  </td>
                  <td
                    className="cursor-pointer px-3"
                    onClick={() =>
                      handleChange(
                        realIndex,
                        'sign',
                        item.sign === '+' ? '-' : '+',
                      )
                    }
                  >
                    {item.sign}
                  </td>
                  <td>
                    <input
                      type="text"
                      className="bg-transparent w-full outline-none"
                      value={item.description}
                      onChange={(e) =>
                        handleChange(realIndex, 'description', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="bg-transparent w-full outline-none"
                      value={item.amount}
                      onChange={(e) =>
                        handleChange(realIndex, 'amount', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => removeItem(realIndex)}
                      className="text-white hover:text-blue-800 text-xl px-3"
                    >
                      X
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-800 p-4 rounded">
            <h2 className="text-lg font-semibold">Receitas</h2>
            <p className="text-2xl">R$ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-red-800 p-4 rounded">
            <h2 className="text-lg font-semibold">Despesas</h2>
            <p className="text-2xl">R$ {totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-lg font-semibold">Saldo</h2>
            <p className="text-2xl">R$ {balance.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
