import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  ScrollArea,
  Select,
  Spoiler,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import dayjs from "../../../utilities/hooks/dayjsRelativeTime";
import { FiPaperclip } from "react-icons/fi";
import { transformAttachments } from "../../../utilities/functions/func";
import { IconSearch, IconFilter2Plus } from "@tabler/icons-react";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { useUpdateProcessDocumentStatusMutation } from "../../../redux/endpoints/documentsEndpoints";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/utilities";
import { BiSolidCommentDetail } from "react-icons/bi";
import Comments from "../../../components/comments/Comments";

const ProcessingLawyers = ({ documentList, isLoading, refetch }) => {
  const [activePage, setActivePage] = useState(1);
  const [searchValue, setSearchValue] = useDebouncedState("", 500);
  const [opened, { open, close }] = useDisclosure(false);

  const totalRecords = documentList?.totalRecords || 1;
  const pageLimit = 15;
  const totalPages = Math.ceil(totalRecords / pageLimit);

  const [updateProcessDocumentStatus, { isLoading: updateLoading }] =
    useUpdateProcessDocumentStatusMutation();

  const validatePayload = (data) => {
    let isValid = false;

    isValid = !isNullOrUndefinedOrEmpty(data.status);

    isValid = !isNullOrUndefinedOrEmpty(data.processId) && isValid;

    return isValid;
  };

  const handleUpdateProcessStatus = async (status, id, docId) => {
    try {
      const payload = {
        status,
        processId: id,
        docId: docId,
      };
      const isValid = validatePayload(payload);
      if (isValid) {
        const response = await updateProcessDocumentStatus(payload).unwrap();
        if (response.status === "SUCCESS") {
          refetch();
        }
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };

  const tableData = {
    caption: "",
    head: [
      <Box py={10} w={140}>
        Code
      </Box>,
      <Box>Title/Designation/Description of documents</Box>,
      <Box w={100}>Assigned</Box>,
      <Box w={250}>Recommendations</Box>,
      <Box w={80}>Action</Box>,
    ],
    body: documentList?.result?.map((info, index) => [
      <Text fz={13} fw={300}>
        {info.codeId}
      </Text>,
      <Flex direction="column" rowGap={10}>
        <Spoiler
          maxHeight={43}
          showLabel="More..."
          hideLabel="Hide"
          styles={{
            control: {
              fontSize: "12px", // smaller font
              color: "#3396D3", // optional custom color
            },
          }}
        >
          <Text fz={13} fw={300}>
            {info.description}
          </Text>
        </Spoiler>
        <div className="flex flex-row justify-between items-center">
          <Group gap="xs" justify="flex-start">
            <FiPaperclip size={16} className="text-gray-400" />
            {transformAttachments(info.path)}
          </Group>
          <Group gap="xs" justify="flex-end">
            <BiSolidCommentDetail
              stroke={1}
              size={18}
              className="cursor-pointer text-orange-500 hover:text-orange-600 transition-all duration-300"
              onClick={() => {
                open();
              }}
            />
          </Group>
        </div>
      </Flex>,
      <Flex direction="column">
        <Text fz={13} fw={300}>
          {dayjs(info.dateAssigned).format("MMM DD, YYYY")}
        </Text>
        <Text fz={10} fw={300} c="blue">
          {dayjs(info.dateAssigned).fromNow()}
        </Text>
      </Flex>,
      <Text fz={13} fw={300}>
        {info.recommendations}
      </Text>,
      <Flex miw={130} align="center">
        <Select
          fw={300}
          description=""
          placeholder=""
          clearable={false}
          data={[
            { value: "Assigned", label: "Assigned" },
            { value: "In progress", label: "In progress" },
            { value: "Pending approval", label: "Pending approval" },
            { value: "Approved", label: "Approved", disabled: true },
          ]}
          value={info.status}
          checkIconPosition="right"
          allowDeselect={false}
          onChange={(value) =>
            handleUpdateProcessStatus(value, info.processId, info.docId)
          }
          disabled={info.status === "Approved"}
          comboboxProps={{
            width: 200,
            position: "bottom-end",
            shadow: "xl",
            size: "sm",
          }}
          styles={{
            input: {
              borderColor: "#0e3557",
              fontSize: "13px",
              color: info.status === "Approved" ? "green" : "inherit", // ✅ selected value
            },
          }}
        />
      </Flex>,
    ]),
  };
  return (
    <main className="border-2 border-gray-400 p-8 border-dashed rounded-2xl">
      <section className="min-h-[80vh]">
        <div>
          <Flex justify="space-between">
            <TextInput
              placeholder="Search document"
              mb="md"
              radius={"xl"}
              leftSection={<IconSearch size={16} stroke={1.5} />}
              w={450}
              defaultValue={searchValue}
              onChange={(event) => {
                setActivePage(1);
                setSearchValue(event.currentTarget.value);
              }}
              styles={{
                input: {
                  borderColor: "#0e3557",
                },
              }}
            />
            <Button
              ta="center"
              fz={13}
              fw={300}
              variant="subtle"
              leftSection={<IconFilter2Plus stroke={1} />}
              onClick={() => {}} // 👈 toggle when clicked
            >
              Add filter
            </Button>
          </Flex>
          <ScrollArea h={"800"} type="auto" offsetScrollbars="y">
            <LoadingOverlay
              visible={isLoading | updateLoading}
              zIndex={150}
              overlayProps={{ blur: 2, radius: "sm" }}
              loaderProps={{ color: "blue", type: "oval" }}
            />
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
        </div>
      </section>
      <section>
        <Modal
          opened={opened}
          onClose={close}
          title="CODE ID"
          centered
          size={"60%"}
          p={10}
        >
          <Comments />
        </Modal>
      </section>
    </main>
  );
};

export default ProcessingLawyers;
