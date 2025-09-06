import {
  Alert,
  Box,
  Button,
  FileButton,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Notification,
  Pagination,
  ScrollArea,
  Spoiler,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import dayjs from "../../../utilities/hooks/dayjsRelativeTime";
import React, { useState, useRef } from "react";
import { FiPaperclip } from "react-icons/fi";
import { transformAttachments } from "../../../utilities/functions/func";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import { GoArrowRight } from "react-icons/go";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/utilities";
import { IconDots, IconSearch, IconFilter2Plus } from "@tabler/icons-react";
import { BsTrash } from "react-icons/bs";
import {
  FORM_ERROR_MESSAGES,
  NOTIFICATION_COLOR,
  NOTIFICATION_TYPE,
} from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { setPayloadObject } from "../../../redux/reducer/releasingReducer";
import {
  useAddNewReleasedDocumentMutation,
  useUpdateReleaseDocumentMutation,
} from "../../../redux/endpoints/documentsEndpoints";
import { useDebouncedState } from "@mantine/hooks";

const notificationInitialValue = {
  type: "",
  header: "",
  message: "",
  color: "",
};

const Releasing = ({ releasingData, isLoading, refetch }) => {
  const dispatch = useDispatch();
  const [activePage, setActivePage] = useState(1);
  const [showDataModal, setShowDataModal] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [files, setFiles] = useState([]);
  const [notifications, setNotifications] = useState(notificationInitialValue);
  const [mainNotifications, setMainNotifications] = useState(
    notificationInitialValue
  );
  const [searchValue, setSearchValue] = useDebouncedState("", 500);
  const resetRef = useRef(null);
  const [addNewReleasedDocument] = useAddNewReleasedDocumentMutation();
  const [updateReleaseDocument] = useUpdateReleaseDocumentMutation();

  const payloadData = useSelector(
    (state) => state.releaseReducers.payloadObject
  );

  const totalRecords = releasingData?.totalRecords || 1;
  const pageLimit = 15;
  const totalPages = Math.ceil(totalRecords / pageLimit);

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearFiles = () => {
    setFiles([]);
    resetRef.current?.();
  };

  const handleRelease = (data) => {
    setMainNotifications(notificationInitialValue);
    dispatch(
      setPayloadObject({
        releaseId: data.releaseId,
        codeId: data.codeId,
        docId: data.docId,
        liaison: "",
      })
    );
    setShowDataModal(data);
    open();
  };

  const validatePayload = (data) => {
    const docs = Array.isArray(data) ? data : [data]; // ensure it's always an array

    for (const itm of docs) {
      if (
        isNullOrUndefinedOrEmpty(itm.receivedBy) ||
        isNullOrUndefinedOrEmpty(itm.releasedDateTime)
      ) {
        setNotifications({
          type: NOTIFICATION_TYPE.ERROR,
          header: "Empty required fields",
          message: FORM_ERROR_MESSAGES.REQUIRED_EMPTY,
          color: NOTIFICATION_COLOR.RED,
        });
        return false;
      }
    }
    return true;
  };

  const handleContinueAndRelease = async () => {
    try {
      const isValid = validatePayload(payloadData);
      if (isValid) {
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payloadData));
        files.forEach((file) => {
          formData.append("attachments", file);
        });
        const response = await updateReleaseDocument(payloadData).unwrap();
        // const response = await addNewReleasedDocument(formData).unwrap();
        if (response.status !== "SUCCESS") {
          setNotifications({
            type: NOTIFICATION_TYPE.ERROR,
            header: "Response error",
            message: response?.message || "",
            color: NOTIFICATION_COLOR.RED,
          });
        } else {
          close();
          setMainNotifications({
            type: NOTIFICATION_TYPE.SUCCESS,
            header: "Success",
            message: FORM_ERROR_MESSAGES.NEW_RELEASED_DOCUMENT_SUCCESS,
            color: NOTIFICATION_COLOR.GREEN,
          });
        }
      }
    } catch (error) {
      setNotifications({
        type: NOTIFICATION_TYPE.ERROR,
        header: "Error",
        message: error?.message || "",
        color: NOTIFICATION_COLOR.RED,
      });
    }
  };

  const handleModalContents = (modalContents = []) => {
    const docs = Array.isArray(modalContents) ? modalContents : [modalContents];
    const modalDataTable = docs.flatMap((itm) => [
      {
        label: (
          <Text fz={14} fw={400} className="min-h-6">
            Code
          </Text>
        ),
        value: itm.codeId,
      },
      {
        label: (
          <Text fz={14} fw={400} className="min-h-6">
            Description
          </Text>
        ),
        value: (
          <Spoiler
            maxHeight={45}
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
              {itm.description}
            </Text>
          </Spoiler>
        ),
      },
      {
        label: (
          <Text fz={14} fw={400} className="min-h-6">
            Approved date
          </Text>
        ),
        value: (
          <Flex direction="row" gap="sm">
            <Text fz={13} fw={300}>
              {dayjs(itm.initialReleaseDate).format("MMM DD, YYYY HH:mm:ss")}
            </Text>
            <Text fz={12} fw={300}>
              {dayjs(
                `${itm?.initialReleaseDate}`,
                "YYYY-MM-DD HH:mm:ss"
              ).fromNow()}
            </Text>
          </Flex>
        ),
      },
      {
        label: (
          <Text fz={14} fw={400} className="min-h-6">
            Outgoing liaison
          </Text>
        ),
        value: "",
      },
      {
        label: (
          <Text fz={14} fw={400} className="min-h-6">
            Date/Time received<span className="text-red-600">*</span>
          </Text>
        ),
        value: (
          <DateTimePicker
            label=""
            placeholder="Select date and time"
            variant="unstyled"
            maxDate={new Date()}
            timePickerProps={{
              withDropdown: false,
              format: "12h",
            }}
            onChange={(value) => {
              setNotifications(notificationInitialValue);
              dispatch(
                setPayloadObject({
                  releasedDateTime: value,
                })
              );
            }}
          />
        ),
      },
      {
        label: (
          <Text fz={14} fw={400} className="min-h-6">
            Receiving personnel<span className="text-red-600">*</span>
          </Text>
        ),
        value: (
          <TextInput
            label=""
            description=""
            placeholder="Add receiving personnel here..."
            variant="unstyled"
            onChange={(event) => {
              setNotifications(notificationInitialValue);
              const personnel = event.target.value;
              dispatch(
                setPayloadObject({
                  receivedBy: personnel,
                })
              );
            }}
          />
        ),
      },
      {
        label: (
          <Text fz={14} fw={400} className="min-h-6">
            Add-on attachment(s)
          </Text>
        ),
        value: (
          <Flex justify="space-between" align="center" gap="sm" direction="row">
            <div className="w-full flex justify-start">
              {files.length > 0 && (
                <Stack gap="xs" mt="sm" align="start">
                  {files.map((file, index) => (
                    <Flex direction="row" gap="sm" align="center">
                      <Text key={index} size="sm" fz={13} lineClamp={1}>
                        📄 {file.name}
                      </Text>
                      <BsTrash
                        size={16}
                        stroke={1}
                        className="text-red-400 cursor-pointer hover:text-red-500"
                        onClick={() => {
                          removeFile(index);
                        }}
                      />
                    </Flex>
                  ))}
                </Stack>
              )}
            </div>
            <div>
              <FileButton
                resetRef={resetRef}
                onChange={(selectedFiles) => {
                  const validFiles = Array.from(selectedFiles || []).filter(
                    (file) =>
                      file.type === "application/pdf" ||
                      file.name.endsWith(".pdf")
                  );
                  if (validFiles.length === 0) {
                    setNotifications({
                      type: NOTIFICATION_TYPE.ERROR,
                      header: "Invalid format",
                      message: FORM_ERROR_MESSAGES.INVALID_FORMAT,
                      color: NOTIFICATION_COLOR.RED,
                    });
                    return;
                  }

                  setNotifications(notificationInitialValue);
                  const renamedFiles = validFiles.map((file, index) => {
                    const newName =
                      index === 0
                        ? `${itm.codeId}-add-on.pdf`
                        : `${itm.codeId}-add-on-${index}.pdf`;
                    return new File([file], newName, { type: file.type });
                  });
                  setFiles(renamedFiles);
                }}
                accept="application/pdf"
                multiple
              >
                {(props) => (
                  <Button {...props} size="xs" w={40} color="#0e3557">
                    <IconDots color="white" size={16} />
                  </Button>
                )}
              </FileButton>
            </div>
          </Flex>
        ),
      },
    ]);

    return (
      <section className="bg-gray-400 p-10 rounded">
        {!isNullOrUndefinedOrEmpty(notifications.type) && (
          <div className="pb-5">
            <Notification
              withCloseButton
              onClose={() => setNotifications(notificationInitialValue)}
              withBorder
              color={notifications.color}
              title={notifications.header}
              variant="light"
              children={notifications.message}
            />
          </div>
        )}
        <Table id="modal-content-table-id" layout="fixed" withTableBorder>
          <Table.Tbody>
            {modalDataTable.map((row, index) => (
              <Table.Tr key={index}>
                <Table.Th
                  w={160}
                  style={{
                    backgroundColor: "#0e3557",
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  {row.label}
                </Table.Th>
                <Table.Td>{row.value}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group justify="flex-end" gap="xs" pt={30}>
          <Button
            radius="xl"
            color="#0e3557"
            variant="outline"
            fw={300}
            onClick={() => {
              setNotifications(notificationInitialValue);
              clearFiles();
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            radius="xl"
            color="#0e3557"
            variant="filled"
            fw={300}
            rightSection={<GoArrowRight size={16} stroke={2} />}
            onClick={handleContinueAndRelease}
          >
            Continue to release
          </Button>
        </Group>
      </section>
    );
  };

  const descriptionData = (document) => {
    return (
      <Flex direction="column" rowGap={10}>
        <Spoiler
          maxHeight={43}
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
            {document?.description}
          </Text>
        </Spoiler>
        <Group gap="xs" justify="flex-start">
          <FiPaperclip size={16} className="text-gray-400" />
          {transformAttachments(document?.attachment)}
        </Group>
      </Flex>
    );
  };

  const dataTable = {
    caption: "",
    head: [
      <Box py={10} w={150}>
        Code
      </Box>,
      <Box>Title/Designation/Description of documents</Box>,
      <Box w={100}>Approved date</Box>,
      <Box w={250}>Recommendations</Box>,
      <Box w={50}>Action</Box>,
    ],
    body: releasingData?.result?.map((doc) => [
      <Text fz={14} fw={300}>
        {doc.codeId}
      </Text>,
      descriptionData(doc),
      <Text fz={13} fw={300}>
        {dayjs(doc.dateAssigned).format("MMM DD, YYYY")}
      </Text>, // format date
      <Text fz={13} fw={300}>
        {doc.recommendations || "-"}
      </Text>,
      <Flex miw={50} align="center">
        <Button
          size="xs"
          fw={300}
          color="#0e3557"
          variant="filled"
          radius="xl"
          onClick={() => {
            handleRelease(doc);
          }}
        >
          <Text c="white" fw={300} fz={12}>
            Release
          </Text>
        </Button>
      </Flex>,
    ]),
  };
  return (
    <main>
      {!isNullOrUndefinedOrEmpty(mainNotifications.type) && (
        <div className="pb-5">
          <Notification
            withCloseButton
            onClose={() => setMainNotifications(notificationInitialValue)}
            withBorder
            color={mainNotifications.color}
            title={mainNotifications.header}
            variant="light"
            children={mainNotifications.message}
          />
        </div>
      )}
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
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ blur: 2, radius: "sm" }}
            loaderProps={{ color: "blue", type: "oval" }}
          />
          <Table
            stickyHeader
            withColumnBorders
            withTableBorder
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
      <section>
        <Modal
          size="xl"
          opened={opened}
          onClose={() => {
            setNotifications(notificationInitialValue);
            clearFiles();
            close();
          }}
          title="Document"
          centered
        >
          {showDataModal && handleModalContents(showDataModal)}
        </Modal>
      </section>
    </main>
  );
};

export default Releasing;
