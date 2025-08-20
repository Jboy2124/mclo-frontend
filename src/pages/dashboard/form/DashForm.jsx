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
} from "@tabler/icons-react";
import { FiPaperclip } from "react-icons/fi";
import dayjs from "dayjs";

const DashForm = ({ data, loading }) => {
  const natureOfComms = useSelector(
    (state) => state.commonCodes.natureOfCommunication
  );
  const receivedThru = useSelector((state) => state.commonCodes.receivedThru);

  const [expandedCards, setExpandedCards] = useState({});
  const [openModal, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useDebouncedState("", 500);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [documentsData, setDocumentData] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalpage, setSearchTotalPages] = useState(1);

  const [findDocuments, { isLoading }] = useFindDocumentsMutation();

  const spoilerMaxHeight = 40;

  const pageLimit = 15;
  const totalPages = Math.ceil(searchTotalpage / pageLimit);

  const getBadgeColor = (status) => {
    if (status === "Receiving") {
      return { color: "yellow", status: "Receiving" };
    } else if (status === "Processing") {
      return { color: "red", status: "Processing" };
    }

    return { color: "blue", status: "Releasing" };
  };

  // const toggleDetails = (index) => {
  //   setExpandedCards((prev) => ({
  //     ...prev,
  //     [index]: !prev[index],
  //   }));
  // };

  // const getDataTimeline = (selectedCode) => {
  //   let activeBranch = 0;
  //   const selectedData = data?.result?.filter(
  //     (data) => data.code_id === selectedCode
  //   );

  //   const receivingData = selectedData[0]?.receiving;
  //   const processingData = selectedData[0]?.processing;
  //   const releasingData = selectedData[0]?.releasing;
  //   if (receivingData) {
  //     activeBranch = 1;
  //   } else if (processingData) {
  //     activeBranch = 2;
  //   } else if (releasingData) {
  //     activeBranch = 3;
  //   } else {
  //     activeBranch = 0;
  //   }

  //   if (selectedCode) {
  //     return (
  //       <Timeline active={activeBranch} bulletSize={18} lineWidth={1} pl={30}>
  //         <Timeline.Item
  //           bullet={activeBranch >= 1 ? () => {} : null}
  //           title="Receiving"
  //         >
  //           <Text c="dimmed" size="sm">
  //             {`New ${getCommonCodeFieldValue(
  //               natureOfComms,
  //               receivingData.natureOfComm
  //             )} received, through ${getCommonCodeFieldValue(
  //               receivedThru,
  //               receivingData.receivedThru
  //             )} forwarded/from ${receivingData?.forwardedBy || ""}.`}
  //           </Text>
  //           <Text size="xs" mt={4}>
  //             {receivingData.receivedTime}
  //           </Text>
  //         </Timeline.Item>

  //         <Timeline.Item
  //           bullet={activeBranch >= 2 ? () => {} : null}
  //           title="Processing"
  //         >
  //           <div className="pb-5">
  //             <Text c="dimmed" size="sm">
  //               You have pushed 23 commits to
  //               <Text variant="link" component="span" inherit>
  //                 fix-notifications branch
  //               </Text>
  //             </Text>
  //             <Text size="xs" mt={4}>
  //               52 minutes ago
  //             </Text>
  //           </div>
  //           <div className="pb-5">
  //             <Text c="dimmed" size="sm">
  //               You have pushed 23 commits to
  //               <Text variant="link" component="span" inherit>
  //                 fix-notifications branch
  //               </Text>
  //             </Text>
  //             <Text size="xs" mt={4}>
  //               52 minutes ago
  //             </Text>
  //           </div>
  //           <div className="pb-5">
  //             <Text c="dimmed" size="sm">
  //               You have pushed 23 commits to
  //               <Text variant="link" component="span" inherit>
  //                 fix-notifications branch
  //               </Text>
  //             </Text>
  //             <Text size="xs" mt={4}>
  //               52 minutes ago
  //             </Text>
  //           </div>
  //         </Timeline.Item>
  //         <Timeline.Item
  //           title="For releasing"
  //           bullet={activeBranch >= 3 ? () => {} : null}
  //           // bullet={<IconGitPullRequest size={12} />}
  //           lineVariant="dashed"
  //         >
  //           <Text c="dimmed" size="sm">
  //             You have submitted a pull request
  //             <Text variant="link" component="span" inherit>
  //               Fix incorrect notification message (#187)
  //             </Text>
  //           </Text>
  //           <Text size="xs" mt={4}>
  //             34 minutes ago
  //           </Text>
  //         </Timeline.Item>

  //         <Timeline.Item
  //           title="Completed"
  //           // bullet={() => {}}
  //           // bullet={<IconMessageDots size={12} />}
  //         >
  //           <Text c="dimmed" size="sm">
  //             <Text variant="link" component="span" inherit>
  //               Robert Gluesticker
  //             </Text>
  //             left a code review on your pull request
  //           </Text>
  //           <Text size="xs" mt={4}>
  //             12 minutes ago
  //           </Text>
  //         </Timeline.Item>
  //       </Timeline>
  //     );
  //   }
  // };

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
      <div className="text-blue-700 hover:text-blue-500 hover:underline underline-offset-4 cursor-pointer">
        <Text fz={15} fw={500}>
          {itm.code_id}
        </Text>
      </div>,
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
                console.log("code ", itm.code_id);
                open();
              }}
            >
              Details
            </Menu.Item>
            <Menu.Item
              leftSection={<IconListTree size={20} stroke={1} />}
              onClick={() => {
                console.log("code ", itm.code_id);
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
      <Box w={100}>Status</Box>,
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
    <main>
      <section className="p-5 min-h-[70vh]">
        <div className="">
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
        </div>
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
            color="teal"
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
        <Modal opened={openModal} onClose={close} centered size={"70%"}>
          asdasd
        </Modal>
      </section>
    </main>
  );
};

export default DashForm;
