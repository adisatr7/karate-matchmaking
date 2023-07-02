export default function UnderConstructionScreen() {
  return (
    <div className="flex flex-col items-center justify-center bg-stone-800">
      <h1
        onClick={() => window.history.back()}
        className="text-white hover:underline font-quicksand text-heading">
        Under Construction
      </h1>
    </div>
  )
}