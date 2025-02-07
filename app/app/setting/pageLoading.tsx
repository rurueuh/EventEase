"use client";

import { FC } from "react";
import { Card, Skeleton } from "@heroui/react";

const SettingSkeleton: FC = () => {
  const fieldsCount = 10;

  const skeletonFields = Array.from({ length: fieldsCount }).map((_, id) => (
    <Card key={id} isHoverable style={{ width: "100%" }}>
      <div style={{ marginBottom: "12px" }}>
        <Skeleton style={{ height: "20px", width: "40%" }} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <Skeleton style={{ height: "40px", width: "100%" }} />
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        <Skeleton style={{ height: "35px", flex: 1 }} />
        <Skeleton style={{ height: "35px", flex: 1 }} />
      </div>
    </Card>
  ));

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "24px" }}
      >
        Paramètres
      </h1>
      <div>{skeletonFields}</div>
    </div>
  );
};

export default SettingSkeleton;
