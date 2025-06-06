export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[350px] space-y-8">
      {/* Modern Loading Circle with Multiple Layers */}
      <div className="relative w-24 h-24">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-gradient-start border-r-primary-gradient-middle animate-spin-slow"></div>

        {/* Middle pulsing ring */}
        <div className="absolute inset-2 rounded-full border-3 border-transparent border-b-primary-gradient-end border-l-primary-gradient-start animate-spin-reverse"></div>

        {/* Inner glowing core */}
        <div className="absolute inset-4 rounded-full bg-primary-gradient animate-pulse-glow shadow-lg"></div>

        {/* Center sparkle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
        </div>

        {/* Floating particles around the circle */}
        <div className="absolute -inset-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-gradient-middle rounded-full animate-float-particle"
              style={{
                top: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                left: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced text with typing effect */}
      <div className="text-center space-y-3">
        <p className="text-xl font-semibold text-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <span className="inline-block animate-typing">Gathering WebInSights</span>
          <span className="animate-blink">...</span>
        </p>
        <p className="text-sm text-muted-foreground animate-fade-in-up max-w-md" style={{ animationDelay: "0.4s" }}>
          Our AI is analyzing your website's performance, sustainability, and optimization opportunities
        </p>

        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mt-4" style={{ animationDelay: "0.6s" }}>
          {["Performance", "Security", "Sustainability", "SEO"].map((item, index) => (
            <div
              key={item}
              className="px-3 py-1 text-xs bg-primary-gradient/10 rounded-full text-primary-gradient-middle animate-fade-in-up"
              style={{ animationDelay: `${0.8 + index * 0.2}s` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
