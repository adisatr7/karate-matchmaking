type PropsType = {
  label: string,
  onClick?: () => void,
  className?: string
}

export default function Button({ label, onClick, className }: PropsType) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-row bg-secondary-gradient hover:bg-primary-gradient rounded-md py-[8px] justify-center items-center ${className}`}>
      <p className="font-quicksand text-white text-center">{label}</p>
    </button>
  )
}