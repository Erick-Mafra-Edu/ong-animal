import Tinder3524 from "../../imports/Tinder3524";
import { useNavigate } from "react-router";
import { Moon, Sun } from "lucide-react";

export default function DarkTheme() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-gray-900 flex items-center justify-center">
      {/* Mobile container */}
      <div className="relative w-full max-w-[390px] h-screen overflow-hidden">
        <Tinder3524 />
        
        {/* Theme toggle button */}
        <button
          onClick={() => navigate("/light")}
          className="absolute bottom-24 right-4 bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/20 transition-colors z-50"
          aria-label="Switch to light theme"
        >
          <Sun className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
