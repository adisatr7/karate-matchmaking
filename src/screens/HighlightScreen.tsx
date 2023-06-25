import MenuBackground from "../components/MenuBackground"
import { useAppSelector } from "../store"


export default function HighlightScreen() {
  const sidebarStatus = useAppSelector(state => state.sidebar.status)

  return (
    <MenuBackground>
      
      <div className="h-fit w-fit rounded-md p-[24px] bg-dark-glass bg-opacity-50 backdrop-blur-md">
        <h2 className="text-white">{sidebarStatus}</h2>
      </div>
      <div>

      </div>
    </MenuBackground>
  )
}