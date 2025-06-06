export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-brand-DEFAULT border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-md font-medium text-slate-600 dark:text-slate-400">Analyzing website...</p>
      <p className="text-sm text-slate-500 dark:text-slate-500">Please wait a moment</p>
    </div>
  )
}
