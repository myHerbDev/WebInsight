import { cn } from "@/lib/utils"

export function LoadingAnimation() {
  const barCount = 5
  const animationDuration = 1.5 // seconds

  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[350px] space-y-6">
      <div className="flex items-end justify-center space-x-1.5 h-12">
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2.5 rounded-full bg-primary-gradient animate-gradient-wave", // Using the gradient
            )}
            style={{
              animationDelay: `${i * (animationDuration / (barCount * 2))}s`,
              animationDuration: `${animationDuration}s`,
              height: `${1 + (i % 3) * 0.75}rem`, // Varying heights: 1rem, 1.75rem, 2.5rem
              backgroundSize: "300% 300%", // For gradient animation
            }}
          />
        ))}
      </div>
      <p className="text-lg font-medium text-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
        Gathering WebInSights...
      </p>
      <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
        Our AI is working its magic. This might take a moment.
      </p>
    </div>
  )
}
