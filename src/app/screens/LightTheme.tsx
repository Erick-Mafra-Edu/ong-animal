import Tinder3523 from "../../imports/Tinder3523";
import { useNavigate } from "react-router";
import { Moon } from "lucide-react";

export default function LightTheme() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Mobile container */}
      <div className="relative w-full max-w-[390px] h-screen overflow-hidden">
        <Tinder3523 />
        
        {/* Theme toggle button */}
        <button
          onClick={() => navigate("/")}
          className="absolute bottom-24 right-4 bg-gray-900/10 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-gray-900/20 transition-colors z-50"
          aria-label="Switch to dark theme"
        >
          <Moon className="w-6 h-6 text-gray-900" />
        </button>
      </div>
    </div>
  );
}
