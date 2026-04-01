import { useNavigate } from "react-router";
import { Moon, Sun } from "lucide-react";
import { AnimalCard } from "../components/AnimalCard";

const sampleAnimals = [
  {
    name: "Yolo",
    age: 26,
    image: "https://images.unsplash.com/photo-1587300411107-ec45cf43c7a6?w=600&h=600&fit=crop",
    tags: ["Online shopping", "Amateur cook", "Anime", "Horror films", "Skincare"],
  },
  {
    name: "Luna",
    age: 3,
    image: "https://images.unsplash.com/photo-1552053831-71594a27c62d?w=600&h=600&fit=crop",
    tags: ["Outdoor", "Active", "Friendly", "Playful"],
  },
];

export default function DarkTheme() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Encontre seu novo amigo</h1>
          <p className="text-gray-400">Deslize para conhecer animais incríveis</p>
        </div>
        
        {/* Theme toggle button */}
        <button
          onClick={() => navigate("/light")}
          className="bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/20 transition-colors z-50"
          aria-label="Switch to light theme"
        >
          <Sun className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto">
        {sampleAnimals.map((animal, index) => (
          <AnimalCard
            key={index}
            name={animal.name}
            age={animal.age}
            image={animal.image}
            tags={animal.tags}
            isDarkTheme={true}
          />
        ))}
      </div>
    </div>
  );
}
