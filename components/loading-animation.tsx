import { Search, BarChart2, Database, Settings2, Lightbulb } from "lucide-react"

export function LoadingAnimation() {
  const orbitingIcons = [
    { Icon: BarChart2, delay: "animate-orbit1", color: "text-blue-500" },
    { Icon: Database, delay: "animate-orbit2", color: "text-green-500" },
    { Icon: Settings2, delay: "animate-orbit3", color: "text-purple-500" },
    { Icon: Lightbulb, delay: "animate-orbit4", color: "text-yellow-500" },
  ]

  return (
    <div className="flex flex-col items-center justify-center py-16 min-h-[300px]">
      <div className="relative w-20 h-20 mb-8">
        {/* Central Pulsing Icon */}
        <Search className="w-12 h-12 text-brand-DEFAULT absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-scale" />

        {/* Orbiting Icons */}
        {orbitingIcons.map(({ Icon, delay, color }, index) => (
          <div
            key={index}
            className={`absolute top-1/2 left-1/2 w-6 h-6 ${delay}`}
            style={{ transformOrigin: "0 0" }} // Orbit around the center of the parent
          >
            <Icon className={`w-full h-full ${color}`} />
          </div>
        ))}
      </div>
      <p className="text-lg font-medium text-slate-700 dark:text-slate-300 animate-fade-in-grow">
        Gathering WebInSights...
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 animate-fade-in-grow" style={{ animationDelay: "0.2s" }}>
        This might take a moment.
      </p>
    </div>
  )
}
