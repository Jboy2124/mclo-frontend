import { ScrollArea, Table } from "@mantine/core";
import React from "react";

const Releasing = () => {
  const dataTable = {
    caption: "",
    head: ["Element position", "Atomic mass", "Symbol", "Element name"],
    body: [
      [6, 12.011, "C", "Carbon"],
      [7, 14.007, "N", "Nitrogen"],
      [39, 88.906, "Y", "Yttrium"],
      [56, 137.33, "Ba", "Barium"],
      [58, 140.12, "Ce", "Cerium"],
    ],
  };
  return (
    <main>
      <section className="p-5 min-h-[70vh]">
        <ScrollArea h={"700"} type="auto" offsetScrollbars="y">
          <Table data={dataTable} />
        </ScrollArea>
      </section>
    </main>
  );
};

export default Releasing;
