import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative w-10 h-10 rounded-full"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full overflow-hidden group hover:bg-primary/10 transition-all duration-300"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Sun icon */}
      <Sun 
        className={`absolute h-5 w-5 text-primary transition-all duration-500 ${
          isDark 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      
      {/* Moon icon */}
      <Moon 
        className={`absolute h-5 w-5 text-primary transition-all duration-500 ${
          isDark 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
      
      {/* Sparkle effect */}
      <div 
        className={`absolute inset-0 transition-all duration-300 ${
          isDark ? 'animate-pulse' : ''
        }`}
      >
        {isDark && (
          <>
            <div className="absolute top-2 right-2 w-1 h-1 bg-primary/60 rounded-full animate-ping" />
            <div className="absolute bottom-3 left-2 w-1 h-1 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </div>
    </Button>
  );
}
