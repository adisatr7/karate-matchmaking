import { useCallback } from "react"
import Particles from "react-particles"
import type { Container, Engine } from "tsparticles-engine"
import { loadFull } from "tsparticles"
import Sidebar from "./Sidebar"


type PropsType = {
  children: React.ReactNode,
}

export default function MenuBackground({ children }: PropsType) {
  // const particlesInit = useCallback(async (engine: Engine) => {
  //   console.log(engine)

  //   // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
  //   // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  //   // starting from v2 you can add only the features you need reducing the bundle size
  //   await loadFull(engine)
  // }, [])

  return (
    <div className="w-screen h-screen flex flex-row bg-cover bg-gradient-to-br from-pink-900 via-[18%] via-indigo-900 to-purple-900">
      
      {/* Sidebar - left side, collapsible */}
      <Sidebar/>

      <div className="flex flex-1 pl-[120px] pr-[20px] py-[28px] ">
        <Particles
        id="particle-background"
        options={{
          particles: {
            number: {
              value: 10, // Adjust the number of particles as desired
              density: {
                enable: true,
                value_area: 800, // Adjust the density area as desired
              },
            },
            size: {
              value: 10, // Adjust the size of particles as desired
            },
            shape: {
              type: 'circle',
            },
            move: {
              enable: true,
              speed: 0.2, // Adjust the movement speed of particles as desired
            },
          },
          interactivity: {
            detectsOn: 'canvas',
            events: {
              onHover: {
                enable: false, // Disable hover interaction
              },
              onClick: {
                enable: false, // Disable click interaction
              },
            },
          }
        }}/>
        {children}
      </div>
      
    </div>
  )
}