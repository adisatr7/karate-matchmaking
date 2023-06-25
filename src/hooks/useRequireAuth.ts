import { useAppSelector } from "../store"


export default function useRequireAuth() {
  const currentUser = useAppSelector(state => state.auth.currentUser)

  // If there is no user, redirect to sign in page
  if (!currentUser) {
    window.location.href = "/login"
    return false
  }

  // If there is a user, return it
  return currentUser
}