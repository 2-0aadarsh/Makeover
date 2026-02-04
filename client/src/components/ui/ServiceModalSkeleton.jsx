/* eslint-disable react/prop-types */
/**
 * Skeleton UI for ServiceModal while category services are loading.
 * Matches grid (tabs + list) and flex (card grid) layouts.
 */

function SkeletonBox({ className = "", rounded = "rounded-lg" }) {
  return (
    <div
      className={`skeleton-shimmer bg-gray-200 ${rounded} ${className}`}
      aria-hidden
    />
  );
}

/** Skeleton for the tabs row (e.g. Classic, Premium) */
export function SkeletonTabs({ count = 3 }) {
  return (
    <div className="relative w-full pb-2 overflow-visible">
      <div className="flex flex-row items-center gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonBox
            key={i}
            className="h-6 w-20 md:w-24"
            rounded="rounded-md"
          />
        ))}
      </div>
    </div>
  );
}

/** Single grid-card row skeleton (image left, lines right, like GridCard) */
function GridRowSkeleton() {
  return (
    <div className="w-full py-3 px-3 md:py-4 md:px-4 rounded-2xl shadow-md flex flex-col lg:flex-row lg:items-center bg-white gap-3">
      <div className="w-full flex flex-row items-center justify-between gap-3">
        <SkeletonBox
          className="w-[64px] h-[64px] md:w-[84px] md:h-[84px] flex-shrink-0 rounded-[14px]"
          rounded="rounded-[14px]"
        />
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <SkeletonBox className="h-5 w-3/4 max-w-[180px]" rounded="rounded" />
          <SkeletonBox className="h-3 w-full max-w-[220px]" rounded="rounded" />
          <div className="flex items-center gap-2 pt-2 mt-1 border-t border-gray-100">
            <SkeletonBox className="h-4 w-20" rounded="rounded" />
            <SkeletonBox className="h-4 w-14" rounded="rounded" />
          </div>
        </div>
        <SkeletonBox className="hidden lg:block h-9 w-[110px] rounded-lg" rounded="rounded-lg" />
      </div>
      <SkeletonBox className="w-full h-10 lg:hidden rounded-lg" rounded="rounded-lg" />
    </div>
  );
}

/** Full grid layout skeleton: 1 col mobile, 2 col md, same as GridCardContainer */
export function ServiceModalGridSkeleton({ rows = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[1034px] gap-3 md:gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <GridRowSkeleton key={i} />
      ))}
    </div>
  );
}

/** Single flex-card skeleton (tall card with image, title, description, price, button) */
function FlexCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-3 md:p-4 min-h-[280px] w-full rounded-2xl shadow-xl bg-white">
      <SkeletonBox
        className="w-full h-[160px] md:h-[200px] rounded-2xl flex-shrink-0"
        rounded="rounded-2xl"
      />
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonBox className="h-5 w-3/4 max-w-[200px]" rounded="rounded" />
        <SkeletonBox className="h-3 w-full" rounded="rounded" />
        <SkeletonBox className="h-3 w-2/3" rounded="rounded" />
        <div className="mt-auto pt-2 flex items-center justify-between">
          <SkeletonBox className="h-5 w-24" rounded="rounded" />
          <SkeletonBox className="h-9 w-28 rounded-lg" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Full flex cards grid skeleton: 1 col mobile, 2 col md, 3 col xl */
export function ServiceModalFlexSkeleton({ cards = 6 }) {
  return (
    <div className="w-full max-w-[1032px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
      {Array.from({ length: cards }).map((_, i) => (
        <FlexCardSkeleton key={i} />
      ))}
    </div>
  );
}
