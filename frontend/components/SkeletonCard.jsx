export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-1" />
        <div className="flex gap-2 mt-2">
          <div className="flex-1 h-7 bg-gray-200 rounded-lg" />
          <div className="flex-1 h-7 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>);

}

export function SkeletonProductRow() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 animate-pulse">
      <div className="w-24 h-28 bg-gray-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="flex gap-2 mt-2">
          <div className="w-24 h-8 bg-gray-200 rounded-lg" />
          <div className="w-24 h-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>);

}

export function SkeletonHero() {
  return (
    <div className="h-64 md:h-96 bg-gray-200 animate-pulse" />);

}

export function SkeletonBanner() {
  return (
    <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />);

}