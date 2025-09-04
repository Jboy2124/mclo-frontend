import { Box, Table } from "@mantine/core";
import React from "react";

const ProcessingLawyers = ({ documentList, isLoading, refetch }) => {
  const tableData = {
    caption: "",
    head: [
      <Box py={10} w={80}>
        Code
      </Box>,
      <Box>Title/Designation/Description of documents</Box>,
      <Box w={50}>Assigned</Box>,
      <Box w={100}>Recommendations</Box>,
      <Box w={100}>Remarks</Box>,
      <Box w={20}>Action</Box>,
    ],
    body: [
      [6, 12.011, "C", "Carbon", "Show", ""],
      [7, 14.007, "N", "Nitrogen", "Show", ""],
      [39, 88.906, "Y", "Yttrium", "Show", ""],
      [56, 137.33, "Ba", "Barium", "Show", ""],
      [58, 140.12, "Ce", "Cerium", "Show", ""],
    ],
  };
  return (
    <main className="border-2 border-gray-400 p-4 border-dashed rounded-2xl">
      <section className="min-h-[80vh]">
        <div>
          <Table
            stickyHeader
            withTableBorder
            withColumnBorders
            striped
            styles={{
              th: {
                background: "linear-gradient(90deg, #0e3557, #174a7e)",
                color: "white",
                fontWeight: 600,
                fontSize: "14px",
              },
              tbody: {
                tr: {
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f5f8fc",
                  },
                },
              },
            }}
            data={tableData}
          />
        </div>
      </section>
    </main>
  );
};

export default ProcessingLawyers;
