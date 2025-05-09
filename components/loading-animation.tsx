export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-purple-500 border-r-teal-500 border-b-purple-500 border-l-teal-500 animate-spin"></div>
        <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-t-transparent border-r-purple-400 border-b-teal-400 border-l-transparent animate-spin animate-reverse"></div>
        <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-t-teal-300 border-r-transparent border-b-purple-300 border-l-transparent animate-spin"></div>
        <div className="absolute top-6 left-6 w-12 h-12 rounded-full border-4 border-t-transparent border-r-teal-200 border-b-transparent border-l-purple-200 animate-spin animate-reverse"></div>
        <div className="absolute top-8 left-8 w-8 h-8 rounded-full border-4 border-t-purple-100 border-r-transparent border-b-teal-100 border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Analyzing website...</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments</p>
    </div>
  )
}
