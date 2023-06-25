type PropsType = {
  label: string,
  onClick?: () => void,
  className?: string
}

export default function Button({ label, onClick, className }: PropsType) {
  return (
    <button 
      onClick={onClick}
      className={`bg-secondary-gradient hover:bg-primary-gradient rounded-md h-[34px] ${className}`}>
      <p className="font-quicksand font-bold text-caption text-white text-center">{label}</p>
    </button>
  )
}