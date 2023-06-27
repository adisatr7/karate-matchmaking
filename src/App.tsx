import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "./store"


export default function App() {
  const isLoggedIn = useAppSelector(state => state.auth.currentUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn)
      navigate("/highlight")
    
    else
      navigate("/login")
  }, [])

  return (
    <div className="bg-stone-900 h-screen w-screen justify-center items-center">
    </div>
  )
}