

type PropsType = {
  children: React.ReactNode,
}

export default function MenuBackground({ children }: PropsType) {
  return (
    <div className="w-screen h-screen flex flex-row bg-cover bg-gradient-to-br from-pink-900 via-[18%] via-indigo-900 to-purple-900">
      {children}
    </div>
  )
}