import { Heart, X, Star } from 'lucide-react';

interface AnimalCardProps {
  name: string;
  age: number;
  image: string;
  tags: string[];
  isDarkTheme?: boolean;
}

export function AnimalCard({ name, age, image, tags, isDarkTheme = false }: AnimalCardProps) {
  return (
    <div className={`flex gap-8 p-8 rounded-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Image Section - Left */}
      <div className="flex-shrink-0 w-96">
        <div className="rounded-lg overflow-hidden h-96 shadow-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Status indicators */}
        <div className="flex gap-2 mt-4 justify-center">
          <div className={`w-3 h-3 rounded-full ${isDarkTheme ? 'bg-white' : 'bg-gray-700'}`} />
          <div className={`w-3 h-3 rounded-full ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-400'}`} />
          <div className={`w-3 h-3 rounded-full ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-400'}`} />
        </div>
      </div>

      {/* Details Section - Right */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Top section with name and age */}
        <div>
          <div className="flex items-baseline gap-3 mb-6">
            <h1 className={`text-4xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {name}
            </h1>
            <span className={`text-2xl font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              {age}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  isDarkTheme
                    ? 'bg-gray-700/50 border-gray-600 text-gray-200'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className={`text-lg leading-relaxed ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8">
          {/* Like button */}
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-orange-500 bg-transparent hover:bg-orange-50 transition-colors">
            <span className="text-xl font-semibold text-orange-600">R</span>
          </button>

          {/* Dislike button */}
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-red-500 bg-transparent hover:bg-red-50 transition-colors">
            <X className="w-6 h-6 text-red-500" />
          </button>

          {/* Super like button */}
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-green-600 bg-transparent hover:bg-green-50 transition-colors">
            <span className="text-xl font-semibold text-green-600">L</span>
          </button>
        </div>
      </div>
    </div>
  );
}
