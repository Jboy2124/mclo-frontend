import {
  Group,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import React, { useState } from "react";

const Releasing = ({ releasingData, isLoading, refetch }) => {
  const [activePage, setActivePage] = useState(1);

  const totalRecords = releasingData?.totalRecords || 1;
  const pageLimit = 15;
  const totalPages = Math.ceil(totalRecords / pageLimit);

  const dataTable = {
    caption: "",
    head: [
      <Text fz={14} fw={400}>
        Code
      </Text>,
      "Description",
      "Date assigned",
      "Recommendations",
      "Remarks",
    ],
    body: releasingData?.result?.map((doc) => [
      doc.codeId,
      doc.description,
      dayjs(doc.dateAssigned).format("MMM DD, YYYY"), // format date
      doc.recommendations || "-",
      doc.remarks || "-",
    ]),
  };
  return (
    <main>
      <section className="p-5 min-h-[70vh]">
        <ScrollArea h={"800"} type="auto" offsetScrollbars="y">
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ blur: 2, radius: "sm" }}
            loaderProps={{ color: "blue", type: "oval" }}
          />
          <Table data={dataTable} />
        </ScrollArea>
        <Group justify="flex-end" mt="lg" px={10} pt={4}>
          <Pagination
            size="md"
            radius="md"
            color="#0e3557"
            withControls
            withEdges
            total={totalPages}
            boundaries={1}
            defaultValue={1}
            value={activePage}
            onChange={() => {}}
          />
        </Group>
      </section>
    </main>
  );
};

export default Releasing;
