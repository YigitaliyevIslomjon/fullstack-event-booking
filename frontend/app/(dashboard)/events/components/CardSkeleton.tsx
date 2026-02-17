export default function EventCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
            <div className="p-6">
                {/* Title skeleton */}
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>

                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>

                {/* Details skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>

                {/* Price and badge skeleton */}
                <div className="flex items-center justify-between mb-4">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>

                {/* Button skeleton */}
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>
        </div>
    );
}
