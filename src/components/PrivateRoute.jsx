// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return <div className="text-white text-center mt-10">Carregando...</div>
  }

  return user ? children : <Navigate to="/" />
}

export default PrivateRoute
