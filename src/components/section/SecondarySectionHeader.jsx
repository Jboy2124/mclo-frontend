import React from "react";
import { Divider, Text, Title } from "@mantine/core";

const SecondarySectionHeader = (props) => {
  const { Header } = props;
  return (
    <section className="px-10 mt-3">
      <Title fw={400} py={3} c={"#0e3557"} order={3}>
        {Header}
      </Title>
      <Divider color="orange" />
    </section>
  );
};

export default SecondarySectionHeader;
