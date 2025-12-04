import ModelViewer3D from "./components/ModelViewer3D";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4 h-screen w-screen ">
      <div className="h-[10%] border-b">
        <Navbar/>
      </div>
      <div className="flex h-[90%] gap-4">
        {/* Left side - Camera + Output */}
        <div className="w-[70%] flex flex-col gap-4">
          <div className="flex w-full h-full gap-4 p-4">
            <div className="bg-gray-300 rounded-xl flex items-center justify-center grow">
              <p>Camera Input Placeholder</p>
            </div>
            <div className="bg-gray-300 rounded-xl flex items-center justify-center grow">
              <p>Stick man</p>
            </div>
          </div>
          <div className="flex w-full h-full gap-4 p-4">
            <div className="bg-gray-300 rounded-xl flex items-center justify-center grow">
              <p>Output Stickman Placeholder</p>
            </div>
            <div className="bg-gray-300 rounded-[50%] flex items-center justify-center h-[200px] w-[200px] mt-7">
              <p>Output Stickman Placeholder</p>
            </div>
          </div>
        </div>

        {/* Right side - 3D Model */}
        <div className="bg-gray-50 rounded-xl h-full grow">
          <ModelViewer3D activeMuscles={[]} />
        </div>
      </div>
    </div>
  );
}
