import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

// Validação de e-mail
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validação de senha
function isValidPassword(password) {
  return password.length >= 6
}

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      alert('E-mail inválido')
      return
    }

    if (!isValidPassword(password)) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (error) {
      alert('Erro ao criar conta: ' + error.message)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/fundoLogin.webm" type="video/webm" />
      </video>
      <form
        onSubmit={handleSignup}
        className="relative z-10 bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Criar Conta
        </h2>
        <input
          type="email"
          placeholder="E-mail"
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full mb-4 bg-white text-black p-2 rounded hover:bg-gray-200 transition"
        >
          Cadastrar
        </button>
        <p
          onClick={() => navigate('/')}
          className="text-sm text-center mt-2 cursor-pointer bg-gradient-to-r from-white bg-[length:100%] bg-clip-text text-transparent transition duration-300 active:scale-110 active:animate-pulse-scale"
        >
          Já tenho conta
        </p>
      </form>
    </div>
  )
}

export default SignupPage
