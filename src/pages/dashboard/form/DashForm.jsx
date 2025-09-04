import {
  Grid,
  Input,
  Spoiler,
  Table,
  Timeline,
  Text,
  MultiSelect,
  Button,
  Card,
  Group,
  Badge,
  Flex,
  ScrollArea,
  Stack,
  Collapse,
  Modal,
  Accordion,
  List,
  Title,
  LoadingOverlay,
  Loader,
  Box,
  Pagination,
  Tooltip,
  Menu,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import SectionHeader from "../../../components/section/SectionHeader";
import { GoDownload } from "react-icons/go";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { useDebouncedState } from "@mantine/hooks";
import { openPdfInBrowser } from "../../../utilities/hooks/pdfViewer";
import { useSelector } from "react-redux";
import {
  getCommonCodeFieldValue,
  getDocumentStatus,
  getFullname,
  transformAttachments,
} from "../../../utilities/functions/func";
import { TbListDetails, TbListTree } from "react-icons/tb";
import { useFindDocumentsMutation } from "../../../redux/endpoints/documentsEndpoints";
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconClipboardData,
  IconListTree,
  IconSearch,
  IconFilter2Plus,
  IconChevronsUpRight,
} from "@tabler/icons-react";
import { FiPaperclip } from "react-icons/fi";
import dayjs from "../../../utilities/hooks/dayjsRelativeTime";

const DashForm = ({ data, loading }) => {
  const natureOfComms = useSelector(
    (state) => state.commonCodes.natureOfCommunication
  );
  const userList = useSelector((state) => state.userList.userProfile);
  const titles = useSelector((state) => state.commonCodes.titles);

  const receivedThru = useSelector((state) => state.commonCodes.receivedThru);
  const [expandedCards, setExpandedCards] = useState({});
  const [openModal, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useDebouncedState("", 500);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [documentsData, setDocumentData] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalpage, setSearchTotalPages] = useState(1);
  const [viewFilterBtn, setViewFilterBtn] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState({ type: null, code: null });

  const [findDocuments, { isLoading }] = useFindDocumentsMutation();

  const pageLimit = 15;
  const totalPages = Math.ceil(searchTotalpage / pageLimit);

  const getBadgeColor = (status) => {
    if (status === "Receiving") {
      return { color: "yellow", status: "Received" };
    } else if (status === "Processing") {
      return { color: "red", status: "Processed" };
    }

    return { color: "blue", status: "Released" };
  };

  const getAssignee = (assignee) => {
    if (assignee) {
      const assigneeArr = assignee.split(",").map((item) => item.trim());
      return assigneeArr || [];
    }
  };

  const transformAssignee = (assignee) => {
    const arr = getAssignee(assignee);
    return userList
      .filter((u) => arr.includes(u.userId))
      .map((u) => (
        <Group gap={0.5}>
          <IconChevronsUpRight stroke={1} size={16} />
          <Text fz={15} fw={500} key={u.userId}>
            {getFullname(u, titles)}
          </Text>
        </Group>
      ));
  };

  const transformReceiver = (received) => {
    const arr = getAssignee(received);
    return userList
      .filter((u) => arr.includes(u.userId))
      .map((u) => (
        <Text fz={12} fw={300} key={u.userId}>
          {`Document was received by ${getFullname(u, titles)}`}
        </Text>
      ));
  };

  const getDataTimeline = (selectedCode) => {
    let activeBranch = 0;
    const selectedData = data?.result?.filter(
      (data) => data.code_id === selectedCode
    );

    const receivingData = selectedData[0]?.receiving;
    const processingData = selectedData[0]?.processing;
    const releasingData = selectedData[0]?.releasing;

    if (processingData && processingData.processStatus === "Assigned") {
    }

    if (releasingData && releasingData?.status === "For releasing") {
      activeBranch = 3;
    } else if (processingData && processingData.processStatus === "Assigned") {
      activeBranch = 2;
    } else if (receivingData && receivingData.status === "Received") {
      activeBranch = 1;
    } else {
      activeBranch = 0;
    }

    if (selectedCode) {
      return (
        <Timeline
          active={activeBranch}
          bulletSize={18}
          lineWidth={1}
          pl={30}
          color="#0e3557"
        >
          <Timeline.Item
            bullet={activeBranch >= 1 ? () => {} : null}
            title="Document Received"
            c={activeBranch >= 1 ? "#0e3557" : "gray"}
          >
            <div className="pb-3">
              <Text c={activeBranch >= 1 ? "#0e3557" : "gray"} size="sm" pb={3}>
                {`New "${getCommonCodeFieldValue(
                  natureOfComms,
                  receivingData.natureOfComm
                )}" received, through ${getCommonCodeFieldValue(
                  receivedThru,
                  receivingData.receivedThru
                )} and forwarded by/from ${receivingData?.forwardedBy || ""}.`}
              </Text>
              {transformReceiver("MCLO20250001")}
              <Text
                size="xs"
                mt={4}
                pt={5}
                c={activeBranch >= 1 ? "#0e3557" : "gray"}
              >
                {`${dayjs(
                  `${dayjs(receivingData.receivedDate).format("YYYY-MM-DD")} ${
                    receivingData.receivedTime
                  }`,
                  "YYYY-MM-DD HH:mm:ss"
                ).fromNow()}`}
              </Text>
            </div>
          </Timeline.Item>
          <Timeline.Item
            bullet={activeBranch >= 2 ? () => {} : null}
            title={`Document ${processingData.processStatus}`}
            c={activeBranch >= 2 ? "#0e3557" : "gray"}
          >
            {activeBranch >= 2 && (
              <div className="pb-3">
                <Text c="#0e3557" size="xs" mb={10} pb={10}>
                  This document has been assigned to the following Lawyers or
                  personnel:
                </Text>
                {transformAssignee(processingData?.assignedTo)}
                <Text size="xs" mt={4} c="#0e3557" pt={10}>
                  {dayjs(
                    `${processingData.dateAssigned}`,
                    "YYYY-MM-DD HH:mm:ss"
                  ).fromNow()}
                </Text>
              </div>
            )}
          </Timeline.Item>
          <Timeline.Item
            title="Document for Release"
            bullet={activeBranch >= 3 ? () => {} : null}
            lineVariant="dashed"
            c={activeBranch >= 3 ? "white" : "gray"}
          >
            {activeBranch >= 3 && (
              <div className="pb-3">
                <Text c="white" size="sm">
                  You have submitted a pull request
                  <Text variant="link" component="span" inherit>
                    Fix incorrect notification message (#187)
                  </Text>
                </Text>
                <Text size="xs" mt={4} c="yellow">
                  34 minutes ago
                </Text>
              </div>
            )}
          </Timeline.Item>
          <Timeline.Item
            title="Completed"
            c={releasingData?.status === "Released" ? "white" : "gray"}
          >
            {releasingData?.status === "Released" && (
              <div className="pb-3">
                <Text c="white" size="sm">
                  <Text variant="link" component="span" inherit>
                    Robert Gluesticker
                  </Text>
                  left a code review on your pull request
                </Text>
                <Text size="xs" mt={4} c="yellow">
                  12 minutes ago
                </Text>
              </div>
            )}
          </Timeline.Item>
        </Timeline>
      );
    }
  };

  const handleGetDocumentStatus = (labelValue) => {
    return getBadgeColor(labelValue);
  };

  const getDocumentData = documentsData?.result?.map((itm, index) => {
    const formattedDate = dayjs(itm?.receiving?.receivedDate).format(
      "MMM DD, YYYY"
    );

    const dt = dayjs(itm?.receiving?.receivedDate).format("YYYY-DD-MM");
    const formattedTime = dayjs(`${dt} ${itm.receiving.receivedTime}`).format(
      "h:mm A"
    );
    const attachedFile = transformAttachments(itm.attachments);
    return [
      <Text fz={15} fw={300} py={20}>
        {itm.code_id}
      </Text>,
      <Flex direction="column" gap={15}>
        <Spoiler
          maxHeight={45}
          showLabel="More..."
          hideLabel="Hide"
          styles={{
            control: {
              fontSize: "12px", // smaller font
              color: "blue", // optional custom color
            },
          }}
        >
          <Text fz={13} fw={300}>
            {itm.description}
          </Text>
        </Spoiler>
        <Group gap="xs" justify="flex-start">
          <FiPaperclip size={16} className="text-gray-400" />
          {attachedFile}
        </Group>
      </Flex>,
      <Badge
        color={
          handleGetDocumentStatus(
            getDocumentStatus(documentsData?.result || [], itm.code_id)?.label
          ).color
        }
        fw={300}
        fz={10}
        size="sm"
        miw={80}
      >
        {
          handleGetDocumentStatus(
            getDocumentStatus(documentsData?.result || [], itm.code_id)?.label
          ).status
        }
      </Badge>,
      formattedDate,
      formattedTime,
      <Flex direction={"row"} gap={5}>
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <Button variant="subtle">
              <IconDots color="black" size={20} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconClipboardData size={20} stroke={1} />}
              onClick={() => {
                setSelectedMenu({ type: "details", code: itm.code_id });
                open();
              }}
            >
              Details
            </Menu.Item>
            <Menu.Item
              leftSection={<IconListTree size={20} stroke={1} />}
              onClick={() => {
                console.log("code ", itm.code_id);
                setSelectedMenu({ type: "timeline", code: itm.code_id });
                open();
              }}
            >
              Timeline
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>,
    ];
  });

  const dataTable = {
    caption: "",
    head: [
      <Box py={10} w={170}>
        Code
      </Box>,
      <Box>Title/Designation/Description of documents</Box>,
      <Box w={80}>Status</Box>,
      <Box w={100}>Date</Box>,
      <Box w={100}>Time</Box>,
      <Box w={50}>Action</Box>,
    ],
    body: getDocumentData,
  };

  const constructPayload = {
    code: searchValue,
    description: searchValue,
    forwardedBy: searchValue,
  };

  const handleNextPage = async (page) => {
    setSearchPage(page);
    try {
      const response = await findDocuments({
        pageNumber: page,
        data: constructPayload,
      }).unwrap();
      setDocumentData({ result: response?.result });
      setSearchTotalPages(response?.totalRecords ?? 0);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      const data = await findDocuments({
        pageNumber: searchPage,
        data: constructPayload,
      }).unwrap(); // ✅ call RTK mutation
      setDocumentData({ result: data?.result });
      setSearchTotalPages(data?.totalRecords ?? 0);
    };

    if (searchValue.trim() !== "") {
      fetchDocuments();
    } else {
      setDocumentData(data);
      setSearchTotalPages(data?.totalRecords);
    }
  }, [data, searchValue, findDocuments]);

  return (
    <main className="border-2 border-gray-400 p-4 border-dashed rounded-2xl">
      <section className="p-5 min-h-[70vh]">
        <Flex direction="row" justify="space-between" pr={10}>
          <TextInput
            placeholder="Search document"
            mb="md"
            radius={"xl"}
            leftSection={<IconSearch size={16} stroke={1.5} />}
            w={450}
            defaultValue={searchValue}
            onChange={(event) => {
              setSearchPage(1);
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
          {/* {viewFilterBtn ? (
            <Button
              ta="center"
              fz={13}
              fw={300}
              variant="subtle"
              leftSection={<IconFilter2Plus stroke={1} />}
              onClick={() => setViewFilterBtn(false)} // 👈 toggle when clicked
            >
              Add filter
            </Button>
          ) : (
            <MultiSelect
              placeholder="Filter"
              data={["date entry", "Status"]}
              clearable
              onClear={() => setViewFilterBtn(true)} // 👈 toggle back when cleared
            />
          )} */}
        </Flex>
        <ScrollArea h={"800"} type="auto" offsetScrollbars="y">
          <LoadingOverlay
            visible={loading | isLoading}
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
            data={dataTable}
          />
        </ScrollArea>
      </section>
      <section
        className="p-5"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <Group justify="flex-end" mt={"md"}>
          <Pagination
            size="md"
            radius="md"
            color="#0e3557"
            withControls
            withEdges
            total={totalPages}
            boundaries={1}
            defaultValue={1}
            value={searchPage}
            onChange={handleNextPage}
          />
        </Group>
      </section>
      <section>
        <Modal
          size="xl"
          opened={openModal}
          onClose={close}
          title={
            <Flex direction="column" gap={0.5} justify="start" align="start">
              <Text fz={15} fw={600}>
                {selectedMenu?.type === "details"
                  ? "Document Details"
                  : "Document Timeline"}
              </Text>
              <Text fz={12} fw={500} fs="italic">
                {selectedMenu.code}
              </Text>
            </Flex>
          }
          centered
        >
          <section className="bg-gray-400 p-10 rounded">
            {selectedMenu?.type === "details" && <>{"Details here"}</>}
            {selectedMenu?.type === "timeline" && (
              <>{getDataTimeline(selectedMenu.code)}</>
            )}
          </section>
        </Modal>
      </section>
    </main>
  );
};

export default DashForm;
