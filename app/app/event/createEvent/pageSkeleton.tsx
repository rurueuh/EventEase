import { Skeleton, Spacer } from "@nextui-org/react";

export default function pageSkeleton() {
  return (
    <div className="mx-auto p-6 shadow-md rounded-lg">
      <Skeleton className="w-full h-[40px] rounded-md" />
      <Spacer y={4} />

      <Skeleton className="w-full h-[80px] rounded-md" />
      <Spacer y={4} />

      <Skeleton className="w-full h-[40px] rounded-md" />
      <Spacer y={4} />

      <Skeleton className="w-full h-[40px] rounded-md" />
      <Spacer y={4} />

      <Skeleton className="w-full h-[40px] rounded-md" />
      <Spacer y={6} />

      <Skeleton className="w-full h-[40px] rounded-md" />
    </div>
  );
}
