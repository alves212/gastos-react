import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

function LoginPage() {
  const [showImage, setShowImage] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPassword = (password) => password.length >= 6

  const handleSubmit = async (e) => {
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
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (error) {
      alert('Erro de login: ' + error.message)
    }
  }

  const handleCreateAccountClick = () => {
    if (showImage) return

    setShowImage(true)

    // 🎵 Reproduz o grito horripilante
    const scream = new Audio('/scream.mp3')
    scream.volume = 0.7 // opcional: ajuste o volume
    scream.play().catch(() => {
      // Algumas vezes o navegador bloqueia, mas seguimos com o fluxo
    })

    setTimeout(() => {
      navigate('/signup')
    }, 600)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 🔥 Vídeo de fundo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/fundoLogin.webm" type="video/webm" />
      </video>

      {/* 💀 Animação da caveira */}
      {showImage && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <img
            src="/skull.png"
            alt="Explosão"
            className="w-20 h-20 animate-growImage origin-center"
          />
        </div>
      )}

      {/* 🧾 Formulário */}
      <form
        onSubmit={handleSubmit}
        className="z-10 bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Login
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
          className="w-full mb-3 bg-white text-black p-2 rounded hover:bg-gray-200 transition"
        >
          Entrar
        </button>
        <p
          onClick={handleCreateAccountClick}
          className="text-sm text-center mt-2 cursor-pointer bg-gradient-to-r from-white bg-[length:100%] bg-clip-text text-transparent transition duration-300 active:scale-110"
        >
          Criar conta
        </p>
      </form>
    </div>
  )
}

export default LoginPage
