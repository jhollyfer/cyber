import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function TableStudentsSkeleton() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-9 w-32 mb-1" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left px-6 py-4">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="text-left px-6 py-4">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="text-center px-6 py-4">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </th>
                <th className="text-center px-6 py-4">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </th>
                <th className="text-center px-6 py-4">
                  <Skeleton className="h-4 w-28 mx-auto" />
                </th>
                <th className="px-6 py-4 w-12" />
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-36" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-12 rounded-full mx-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
