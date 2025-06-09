import { Leaf } from "lucide-react" // Using Leaf as a placeholder logo icon

export function Logo({ className }: { className?: string }) {
  return <Leaf className={`text-green-600 dark:text-green-500 ${className}`} />
}
