import { Divider, Text } from "@mantine/core";
import React from "react";

const SectionHeader = (props) => {
  const { HeaderName } = props;
  return (
    <section className="px-10 mt-10">
      <Text fw={500} size="md" py={5} c={"#0e3557"}>
        {HeaderName}
      </Text>
      <Divider color="orange" />
    </section>
  );
};

export default SectionHeader;
