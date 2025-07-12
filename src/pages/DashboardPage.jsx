// src/pages/DashboardPage.jsx
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
  const [sortMode, setSortMode] = useState('original') // original, asc, desc
  const [originalOrder, setOriginalOrder] = useState([])
  const [filterState, setFilterState] = useState(0) // 0: todos, 1: marcados, 2: desmarcados

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
      const sorted = [...items].sort((a, b) => a.amount - b.amount)
      setItems(sorted)
      setSortMode('asc')
    } else if (sortMode === 'asc') {
      const sorted = [...items].sort((a, b) => b.amount - a.amount)
      setItems(sorted)
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
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => addItem('+')}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          +
        </button>
        <button
          onClick={() => addItem('-')}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          -
        </button>
        <button
          onClick={moveRowUp}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬆️
        </button>
        <button
          onClick={moveRowDown}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬇️
        </button>
        <button
          onClick={toggleSort}
          className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
        >
          {sortMode === 'original' ? '🔄' : sortMode === 'asc' ? '⬆️' : '⬇️'}
        </button>
        <button
          onClick={toggleFilter}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
        >
          {filterState === 0 ? '📋' : filterState === 1 ? '🟦' : '⬜'}
        </button>
        <button
          onClick={logout}
          className="ml-auto bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
        >
          Sair
        </button>
      </div>

      <table className="w-full text-left border-collapse">
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
                }`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={item.checked || false}
                    onChange={() => handleChange(realIndex, 'checked')}
                  />
                </td>
                <td
                  className="cursor-pointer px-2"
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
                    className="bg-transparent border-b w-full outline-none"
                    value={item.description}
                    onChange={(e) =>
                      handleChange(realIndex, 'description', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="bg-transparent border-b w-full outline-none"
                    value={item.amount}
                    onChange={(e) =>
                      handleChange(realIndex, 'amount', e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    onClick={() => removeItem(realIndex)}
                    className="text-red-400 hover:text-red-200"
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
  )
}

export default DashboardPage
