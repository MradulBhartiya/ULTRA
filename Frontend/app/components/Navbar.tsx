export default function Navbar() {
  return (
    <nav className="flex justify-between bg-white h-[50px] p-2 pr-[35%]">
      <div className="flex justify-center items-center">
        <h1 className="text-xl font-semibold text-black">Exercise Analyzer</h1>
      </div>
      <div className="flex gap-2 bg-white rounded-3xl px-4 py-2 shadow-lg shadow-gray-500 justify-between items-center w-[50%]">
        <a className="hover:bg-gray-200 p-1 rounded-xl">Exercises</a>
        <a className="hover:bg-gray-200 p-1 rounded-xl">History</a>
        <a className="hover:bg-gray-200 p-1 rounded-xl">Login</a>
        <a className="hover:bg-gray-200 p-1 rounded-xl">Developer</a>
        <a className="hover:bg-gray-200 p-1 rounded-xl">Feedback</a>
      </div>
    </nav>
  );
}