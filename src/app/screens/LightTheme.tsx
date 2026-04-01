import { useNavigate } from "react-router";
import { Moon } from "lucide-react";
import { AnimalCard } from "../components/AnimalCard";

const sampleAnimals = [
  {
    name: "Phoenix",
    age: 4,
    image: "https://images.unsplash.com/photo-1570129477492-45b003493af0?w=600&h=600&fit=crop",
    tags: ["Adventure", "Loyal", "Energetic", "Family-friendly"],
  },
  {
    name: "Aurora",
    age: 2,
    image: "https://images.unsplash.com/photo-1583511655857-d19db992cb74?w=600&h=600&fit=crop",
    tags: ["Sweet", "Gentle", "Calm", "Cuddly"],
  },
];

export default function LightTheme() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Encontre seu novo amigo</h1>
          <p className="text-gray-600">Deslize para conhecer animais incríveis</p>
        </div>
        
        {/* Theme toggle button */}
        <button
          onClick={() => navigate("/")}
          className="bg-gray-900/10 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-gray-900/20 transition-colors z-50"
          aria-label="Switch to dark theme"
        >
          <Moon className="w-6 h-6 text-gray-900" />
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
            isDarkTheme={false}
          />
        ))}
      </div>
    </div>
  );
}
