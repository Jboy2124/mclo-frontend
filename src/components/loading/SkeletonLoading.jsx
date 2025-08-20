import { Skeleton } from "@mantine/core";
import React from "react";

const SkeletonLoading = (loading) => {
  return (
    <div>
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </div>
  );
};

export default SkeletonLoading;
