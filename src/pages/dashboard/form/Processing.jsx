import {
  Title,
  Table,
  Checkbox,
  Text,
  Group,
  Button,
  Textarea,
  ScrollArea,
  Pagination,
  TextInput,
  Flex,
  Spoiler,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import {
  getCommonCodeFieldValue,
  transformAttachments,
} from "../../../utilities/functions/func";
import { useSelector } from "react-redux";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/utilities";
import {
  useAddNewProcessingDataMutation,
  useFindProcessingDocumentsMutation,
  useGetProcessingDocumentListQuery,
} from "../../../redux/endpoints/documentsEndpoints";
import Swal from "sweetalert2";
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconClipboardData,
  IconListTree,
  IconSearch,
  IconFilter2Plus,
} from "@tabler/icons-react";
import { useDebouncedState } from "@mantine/hooks";
import { FiPaperclip } from "react-icons/fi";

const Processing = ({
  data,
  loadingProcess,
  refetchDocuments,
  userList,
  userLoading,
}) => {
  const [selectedDataRows, setSelectedDataRows] = useState([]);
  const [selectedAssigneeRows, setSelectedAssigneeRows] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [searchValue, setSearchValue] = useDebouncedState("", 500);
  const [documentList, setDocumentList] = useState([]);
  const [totalRetrievedRecords, setTotalRetrievedRecords] = useState(1);
  const [addNewProcessingData, { isLoading }] =
    useAddNewProcessingDataMutation();
  const [
    findProcessingDocuments,
    { isLoading: findProcessingLoading, isFetching: findProcessingFetching },
  ] = useFindProcessingDocumentsMutation();
  const formInitialValues = {
    recommendations: "",
    remarks: "",
  };

  const submitForm = useForm({
    mode: "controlled",
    initialValues: formInitialValues,
    validate: {
      recommendations: (value) =>
        isNullOrUndefinedOrEmpty(value)
          ? " Recommendation cannot be empty."
          : null,
    },
  });

  const titleList = useSelector((state) => state.commonCodes.titles);
  const designationList = useSelector((state) => state.commonCodes.designation);

  const totalRecords = totalRetrievedRecords;
  const pageLimit = 15;
  const totalPages = Math.ceil(totalRecords / pageLimit);

  const transformUserList = () => {
    const data = userList?.result?.map((itm, index) => {
      return {
        id: itm.userId,
        email: itm.email,
        assignee: `${getCommonCodeFieldValue(titleList, itm.title)} ${
          itm.fname
        } ${itm.lname}`,
        designation: getCommonCodeFieldValue(designationList, itm.designation),
      };
    });

    return data || [];
  };

  const documentMetaData = () => {
    return documentList?.result?.map((itm, index) => ({
      code: itm.code,
      description: itm.description,
      attachments: itm.attachments,
    }));
  };

  const elements = documentMetaData() || [];
  const allDataRowIds = elements.map((el) => el.code);
  const allDataSelected = selectedDataRows.length === elements.length;
  const partiallySelectedData =
    selectedDataRows.length > 0 && selectedDataRows.length < elements.length;

  const toggleSelectAllData = (checked) => {
    setSelectedDataRows(checked ? allDataRowIds : []);
  };

  const toggleRow = (code, checked) => {
    setSelectedDataRows(
      checked
        ? [...selectedDataRows, code]
        : selectedDataRows.filter((id) => id !== code)
    );
  };

  const dataRows = elements.map((element) => (
    <Table.Tr
      key={element.code}
      bg={
        selectedDataRows.includes(element.code)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          variant="outline"
          checked={selectedDataRows.includes(element.code)}
          onChange={(event) =>
            toggleRow(element.code, event.currentTarget.checked)
          }
          styles={{
            input: {
              borderColor: "#0e3557", // ✅ custom border color
              "&:checked": {
                backgroundColor: "#0e3557", // ✅ fill color when checked
                borderColor: "#0e3557", // ✅ border color when checked
              },
              "&:hover": {
                borderColor: "#174a7e", // ✅ hover effect
              },
            },
          }}
        />
      </Table.Td>
      <Table.Td fw={300} fz={14}>
        {element.code}
      </Table.Td>
      <Table.Td fw={300} fz={13}>
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
              {element.description}
            </Text>
          </Spoiler>
          <Group gap="xs" justify="flex-start">
            <FiPaperclip size={16} className="text-gray-400" />
            {transformAttachments(element.attachments)}
          </Group>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  const viewDataTable = () => {
    return (
      <ScrollArea h={728} type="auto" offsetScrollbars="y">
        <LoadingOverlay
          visible={
            loadingProcess |
            isLoading |
            findProcessingLoading |
            findProcessingFetching
          }
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
        >
          <Table.Thead className="bg-blue-400">
            <Table.Tr>
              <Table.Th w={20} py={20}>
                <Checkbox
                  aria-label="Select all rows"
                  variant="outline"
                  checked={allDataSelected}
                  indeterminate={partiallySelectedData}
                  onChange={(event) =>
                    toggleSelectAllData(event.currentTarget.checked)
                  }
                  styles={{
                    input: {
                      borderColor: "#0e3557", // ✅ custom border color
                      "&:checked": {
                        backgroundColor: "#0e3557", // ✅ fill color when checked
                        borderColor: "#0e3557", // ✅ border color when checked
                      },
                      "&:hover": {
                        borderColor: "#174a7e", // ✅ hover effect
                      },
                    },
                  }}
                />
              </Table.Th>
              <Table.Th w={160}>Coding System</Table.Th>
              <Table.Th>Title/Designation</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{dataRows}</Table.Tbody>
        </Table>
      </ScrollArea>
    );
  };

  const assigneeElements = transformUserList();
  const allAssigneeRowIds = assigneeElements.map((el) => el.id);
  const allAssigneeSelected =
    selectedAssigneeRows.length === assigneeElements.length;
  const partiallySelectedAssignee =
    selectedAssigneeRows.length > 0 &&
    selectedAssigneeRows.length < assigneeElements.length;

  const toggleSelectAllAssignee = (checked) => {
    setSelectedAssigneeRows(checked ? allAssigneeRowIds : []);
  };

  const toggleAssigneeRow = (id, checked) => {
    const selectedAssignee = checked
      ? [...selectedAssigneeRows, id]
      : selectedAssigneeRows.filter((id) => id !== id);
    setSelectedAssigneeRows(selectedAssignee);
  };

  const assigneeRows = assigneeElements.map((element) => (
    <Table.Tr
      key={element.id}
      bg={
        selectedAssigneeRows.includes(element.id)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          variant="outline"
          aria-label="Select row"
          checked={selectedAssigneeRows.includes(element.id)}
          onChange={(event) =>
            toggleAssigneeRow(element.id, event.currentTarget.checked)
          }
          styles={{
            input: {
              borderColor: "#0e3557", // ✅ custom border color
              "&:checked": {
                backgroundColor: "#0e3557", // ✅ fill color when checked
                borderColor: "#0e3557", // ✅ border color when checked
              },
              "&:hover": {
                borderColor: "#174a7e", // ✅ hover effect
              },
            },
          }}
        />
      </Table.Td>
      <Table.Td fw={300} fz={14}>
        {element.id}
      </Table.Td>
      <Table.Td fw={30} fz={14}>
        {element.assignee}
      </Table.Td>
    </Table.Tr>
  ));

  const viewAssigneeTable = () => {
    return (
      <ScrollArea h={500} type="auto" offsetScrollbars="y">
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
        >
          <Table.Thead className="bg-purple-400">
            <Table.Tr>
              <Table.Th w={10} py={20}>
                <Checkbox
                  variant="outline"
                  aria-label="Select all rows"
                  checked={allAssigneeSelected}
                  indeterminate={partiallySelectedAssignee}
                  onChange={(event) =>
                    toggleSelectAllAssignee(event.currentTarget.checked)
                  }
                  styles={{
                    input: {
                      borderColor: "#0e3557", // ✅ custom border color
                      "&:checked": {
                        backgroundColor: "#0e3557", // ✅ fill color when checked
                        borderColor: "#0e3557", // ✅ border color when checked
                      },
                      "&:hover": {
                        borderColor: "#174a7e", // ✅ hover effect
                      },
                    },
                  }}
                />
              </Table.Th>
              <Table.Th w={120}>Id</Table.Th>
              <Table.Th>Assignee</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{assigneeRows}</Table.Tbody>
        </Table>
      </ScrollArea>
    );
  };

  const handleSubmitDocumentDetails = async (data) => {
    try {
      const assigneePayload = assigneeElements
        .filter((el) => selectedAssigneeRows.includes(el.id))
        .map((el) => ({
          id: el.id,
          email: el.email,
          name: el.assignee,
        }));

      const documentsPayload = elements
        .filter((el) => selectedDataRows.includes(el.code))
        .map((el) => ({
          code: el.code,
          description: el.description,
        }));

      const tranformPayload = {
        documents: documentsPayload,
        assignee: assigneePayload,
        recommendation: data.recommendations,
        remarks: data.remarks,
      };

      const response = await addNewProcessingData(tranformPayload).unwrap();
      if (response.status === "SUCCESS") {
        Swal.fire({
          title: "SUCCESS",
          text: "Selected document has been assigned.",
          icon: "success",
        });
      }
      handleResetForm();
      await refetchDocuments();
      handleNextPage(activePage);
      setActivePage(1);
    } catch (error) {
      Swal.fire({
        title: "ERROR",
        text: error,
        icon: "error",
      });
    }
  };

  const handleResetForm = () => {
    submitForm.reset();
    setSelectedAssigneeRows([]);
    setSelectedDataRows([]);
  };

  const constructPayload = {
    code: searchValue,
    description: searchValue,
  };

  const handleNextPage = async (page) => {
    setActivePage(page);
    try {
      const response = await findProcessingDocuments({
        pageNumber: page,
        data: constructPayload,
      }).unwrap();
      setDocumentList(response);
    } catch (error) {}
  };

  useEffect(() => {
    const searchProcessingDocuments = async () => {
      const response = await findProcessingDocuments({
        pageNumber: 1,
        data: constructPayload,
      }).unwrap();

      setDocumentList(response);
      setTotalRetrievedRecords(
        response?.totalRecords === 0 ? 1 : response?.totalRecords
      );
    };

    if (searchValue !== "") {
      searchProcessingDocuments();
    } else {
      setDocumentList(data);
      setTotalRetrievedRecords(data?.totalRecords);
    }
  }, [data, searchValue]);

  return (
    <main className="p-5">
      <form onSubmit={submitForm.onSubmit(handleSubmitDocumentDetails)}>
        <section className="container mx-auto">
          <div className="flex flex-row justify-between items-start">
            <div className="w-full px-5">
              <Text pb={5} fz={15} fw={400}>
                Documents
              </Text>
              <div className="min-h-[10vh] border-2 border-gray-400 p-4 border-dashed rounded-2xl">
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
                {viewDataTable()}
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
                    onChange={handleNextPage}
                  />
                </Group>
              </div>
            </div>
            <div className="w-[45rem] min-h-[10vh] px-5">
              <Text pb={5} fz={15} fw={400}>
                Assignee
              </Text>
              <div className="flex flex-col justify-start gap-3">
                <div className="min-h-[19vh] border-2 border-gray-400 p-4 border-dashed rounded-2xl">
                  <div className="py-[26px]"></div>
                  {viewAssigneeTable()}
                </div>
                <div>
                  <Text py={5} fz={15} fw={400}>
                    Recommendations & remarks
                  </Text>
                  <div className="min-h-[25vh] border-2 border-gray-400 border-dashed rounded-2xl">
                    <Textarea
                      label="Recommendations"
                      placeholder="Add your recommendations here"
                      labelProps={{ fw: 300 }}
                      rows={3}
                      minRows={3}
                      maxRows={6}
                      size="sm"
                      mx={30}
                      pt={16}
                      pb={8}
                      withAsterisk
                      key={submitForm.key("recommendations")}
                      {...submitForm.getInputProps("recommendations")}
                      styles={{
                        input: {
                          borderColor: "#0e3557",
                        },
                      }}
                    />
                    <Textarea
                      label="Remarks"
                      placeholder="Add your remarks here"
                      labelProps={{ fw: 300 }}
                      rows={2}
                      minRows={3}
                      maxRows={6}
                      size="sm"
                      mx={30}
                      key={submitForm.key("remarks")}
                      {...submitForm.getInputProps("remarks")}
                      styles={{
                        input: {
                          borderColor: "#0e3557",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="button-section" className="container mx-auto pt-10 px-5">
          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              w={150}
              radius="xl"
              color="#0e3557"
              size="md"
              onClick={handleResetForm}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              w={150}
              radius="xl"
              type="submit"
              color="#0e3557"
              size="md"
            >
              Assign
            </Button>
          </Group>
        </section>
      </form>
    </main>
  );
};

export default Processing;
