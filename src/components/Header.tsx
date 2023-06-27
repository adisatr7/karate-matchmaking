import ProfileButton from "../components/ProfileButton"


type PropsType = {
  pageName: string
}

export default function Header({ pageName }: PropsType) {
  return (
    <div className="flex flex-row h-fit w-full justify-between items-end">
      <h1 className="font-quicksand text-white text-heading">{pageName}</h1>
      <ProfileButton/>
    </div>
  )
}