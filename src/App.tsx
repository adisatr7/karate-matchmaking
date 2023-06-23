// Import components

// Import icons that will be used throughout the app
import { library } from "@fortawesome/fontawesome-svg-core"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import HighlightScreen from "./screens/HighlightScreen"

// Register the icons
library.add(faBars, faXmark)  


export default function App() {
  return <HighlightScreen/>
}