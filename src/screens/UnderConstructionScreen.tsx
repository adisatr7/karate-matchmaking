export default function UnderConstructionScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-stone-800">
      <h1
        onClick={() => window.history.back()}
        className="text-white hover:underline font-quicksand text-heading hover:cursor-pointer">
        Under Construction
      </h1>
    </div>
  )
}