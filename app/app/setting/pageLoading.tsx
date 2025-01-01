"use client";

import { Skeleton, Spacer } from "@nextui-org/react";

export default function PageSkeleton() {
  return (
    <div className="flex">
      <aside className="block basis-2/5">
        <Skeleton className="mx-auto w-[300px] h-[300px] rounded-lg" />

        <Spacer y={16} />

        <Skeleton className="mx-auto w-[60%] h-[20px] rounded-md" />

        <Spacer y={16} />

        <Skeleton className="mx-auto w-[60%] h-[20px] rounded-md" />
      </aside>

      <div className="block basis-3/5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-[40%] h-[30px] rounded-md" />
          <Skeleton className="w-[20%] h-[30px] rounded-md" />
        </div>

        <Spacer y={2} />

        {/* Job */}
        <Skeleton className="w-[30%] h-[20px] rounded-md" />

        <Spacer y={4} />

        <Skeleton className="w-[80px] h-[20px] rounded-md" />

        <Spacer y={4} />

        <div className="flex gap-4">
          <Skeleton className="w-[120px] h-[40px] rounded-md" />
          <Skeleton className="w-[120px] h-[40px] rounded-md" />
          <Skeleton className="w-[160px] h-[40px] rounded-md" />
        </div>

        <Spacer y={8} />

        <div className="flex gap-6 pb-2">
          <Skeleton className="w-[100px] h-[40px] rounded-md" />
          <Skeleton className="w-[100px] h-[40px] rounded-md" />
          <Skeleton className="w-[100px] h-[40px] rounded-md" />
        </div>

        <Spacer y={4} />

        <Skeleton className="w-[80%] h-[60px] rounded-md" />
      </div>
    </div>
  );
}
