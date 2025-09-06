import {
  NativeSelect,
  Textarea,
  Text,
  Group,
  Stack,
  Paper,
  TextInput,
  CloseButton,
  Button,
  Tooltip,
  Select,
  Title,
  Flex,
  Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import React, { useState } from "react";
import { DateInput, TimeInput } from "@mantine/dates";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/utilities";
import { BsFiletypePdf, BsFileEarmarkPdfFill } from "react-icons/bs";
import SectionHeader from "../../../components/section/SectionHeader";
import { useAddNewReceivingDataMutation } from "../../../redux/endpoints/documentsEndpoints";
import {
  useGetDocumentsCountPerTypeMutation,
  useFindDocumentsByCodeIdQuery,
} from "../../../redux/endpoints/documentsEndpoints";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { setReceivingPayload } from "../../../redux/reducer/receivingReducer";
import { IconChevronsUpRight } from "@tabler/icons-react";

const Receiving = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state?.auth?.authUser);
  const [files, setFiles] = useState([]);
  const [value, setValue] = useState(null);
  const [filesAttached, setFilesAttached] = useState(0);
  const [timeValue, setTimeValue] = useState("");
  const [getCodeValue, setCodeValue] = useState("");
  const [codeHasError, setCodeHasError] = useState(false);

  const [addNewReceivingData] = useAddNewReceivingDataMutation();
  const [getDocumentsCountPerType, { isLoading }] =
    useGetDocumentsCountPerTypeMutation();
  // const { data: codeQueryResponse = [], isLoading: codeQueryLoading } =
  //   useFindDocumentsByCodeIdQuery({ code: getCodeValue });
  const [natureCommSelectedValue, setNatureCommSelectedValue] = useState("");
  const [addNewCode, setAddNewCode] = useState("");
  const [selectedDocType, setSelectedDocType] = useState(null);
  const initialFormValues = {
    code: "",
    date: "",
    time: "",
    description: "",
    forwardedBy: "",
    natureOfComm: null,
    receivedThru: null,
  };

  const submitForm = useForm({
    mode: "controlled",
    initialValues: initialFormValues,
    validate: {
      code: (value) =>
        isNullOrUndefinedOrEmpty(value)
          ? "Code field is not allowed to be empty"
          : null,
      date: (value) =>
        isNullOrUndefinedOrEmpty(value)
          ? "Date field is not allowed to be empty"
          : null,
      time: (value) =>
        isNullOrUndefinedOrEmpty(value)
          ? "Time field is not allowed to be empty"
          : null,
      description: (value) =>
        isNullOrUndefinedOrEmpty(value)
          ? "Description field is not allowed to be empty"
          : null,
      forwardedBy: (value) =>
        isNullOrUndefinedOrEmpty(value)
          ? "Forwardedby field is not allowed to be empty"
          : null,
      natureOfComm: (value) =>
        isNullOrUndefinedOrEmpty(value)
          ? "Nature of communication field is not allowed to be empty"
          : null,
      receivedThru: (value) =>
        isNullOrUndefinedOrEmpty(value)
          ? "Received through field is not allowed to be empty"
          : null,
    },
  });

  const natureOfCommList = useSelector(
    (state) => state?.commonCodes?.natureOfCommunication
  );
  const receivedThru = useSelector((state) => state?.commonCodes?.receivedThru);
  const docTypes = useSelector((state) => state?.commonCodes.documentTypes);
  const receivingData = useSelector(
    (state) => state?.receivingReducers?.receivingPayload
  );

  const natureCommCodes = natureOfCommList?.result || [];
  const receivedThruCodes = receivedThru?.result || [];
  const documentTypeList = docTypes?.result || [];

  const handleDrop = (acceptedFiles) => {
    const codeId = submitForm.values.code || "temp"; // fallback to 'temp' if code is empty

    const renamed = acceptedFiles.map((file, index) => {
      const extension = file.name.split(".").pop();
      const newName =
        files.length + index === 0
          ? `${codeId}.${extension}`
          : `${codeId}-${files.length + index}.${extension}`;
      return new File([file], newName, { type: file.type });
    });

    setFiles((prev) => {
      const updated = [...prev, ...renamed];
      setFilesAttached(updated.length); // update file count
      return updated;
    });
  };

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("receivedBy", userId);

      // Append text fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (selectedDocType) {
        formData.append("docType", selectedDocType);
      }

      // Append PDF files
      files.forEach((file) => {
        formData.append("attachments", file); // match this key with your backend
      });

      // Use the `addNewReceivingData` mutation (ensure your endpoint handles multipart/form-data)
      const response = await addNewReceivingData(formData).unwrap();
      if (response.status === "SUCCESS") {
        Swal.fire({
          title: "Success",
          text: "New document has been added.",
          icon: "success",
        });
      }
      handleResetForm();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
      });
    }
  };

  const handleResetForm = () => {
    submitForm.reset(); // resets all to initialValues
    submitForm.setFieldValue("natureOfComm", null);
    submitForm.setFieldValue("receivedThru", null);
    setFiles([]);
    setFilesAttached(0);
    setValue(null);
    setTimeValue("");
  };

  const formatDocumentCount = (count) => {
    return count.toString().padStart(5, "0");
  };

  const handleCreateNewDocument = async ({ id, keyValue }) => {
    const prefix = "MCLO";
    const docType = keyValue;
    const yearGenerated = new Date().getFullYear().toString().slice(-2);
    let docCount = 0;

    const response = await getDocumentsCountPerType({ docId: id }).unwrap();
    if (response.status === "SUCCESS") {
      const result = response?.result;
      docCount = result?.count + 1;
    }

    const newGeneratedCode = `${prefix}-${docType}-${yearGenerated}-${formatDocumentCount(
      docCount
    )}`;

    setAddNewCode(newGeneratedCode);
    setSelectedDocType(id);
    submitForm.setFieldValue("code", newGeneratedCode);
  };

  return (
    <main className="px-50">
      <form onSubmit={submitForm.onSubmit(handleSubmit)}>
        <section className="container mx-auto bg-gray-300 border-2 border-gray-400 p-4 border-dashed rounded-2xl">
          <div className="px-10 py-10">
            <Title fw={500} c="#0e3557" order={2}>
              Receiving Section
            </Title>
          </div>
          <section id="code-section" className="pb-10">
            <SectionHeader HeaderName={"Code system"} />
            <div className="flex flex-row justify-start px-10 py-2">
              <div className="w-full">
                <Text size="sm" fw={300} c="dimmed">
                  Use the standard coding system.
                </Text>
              </div>
              <div className="w-full">
                <Flex gap={4}>
                  <div className="pt-[19px]">
                    <Menu shadow="lg" width={300}>
                      <Menu.Target>
                        <Button color="#0e3557">+</Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label color="#0e3557">Document Type</Menu.Label>
                        {documentTypeList?.map((itm, index) => {
                          return (
                            <Menu.Item
                              key={index}
                              onClick={() => {
                                handleCreateNewDocument({
                                  id: itm.id,
                                  keyValue: itm.shortcut,
                                });
                                dispatch(
                                  setReceivingPayload({
                                    natureOfCommId: itm.id,
                                    natureOfComm: itm.value,
                                  })
                                );
                              }}
                            >
                              <Group gap={0.5}>
                                <IconChevronsUpRight stroke={1} size={14} />
                                <Text fz={13} fw={400} key={index + itm.id}>
                                  {itm.value}
                                </Text>
                              </Group>
                            </Menu.Item>
                          );
                        })}
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                  <TextInput
                    description="Code"
                    placeholder="Enter code"
                    withAsterisk
                    readOnly
                    value={addNewCode}
                    w={250}
                    key={submitForm.key("code")}
                    {...submitForm.getInputProps("code")}
                    styles={{
                      input: {
                        borderColor: "#0e3557",
                      },
                    }}
                  />
                </Flex>
              </div>
            </div>
          </section>
          <section id="date-time-section">
            <SectionHeader HeaderName={"Date & time entry"} />
            <div className="flex flex-row justify-start px-10 py-2">
              <div className="w-full">
                <Text size="sm" fw={300} c="dimmed">
                  Date and time entry upon receiving of document(s)/paper(s).
                </Text>
              </div>
              <div className="flex flex-col w-full">
                <div className="w-full pb-5">
                  <DateInput
                    description="Date"
                    labelProps={{ fw: 300 }}
                    placeholder="MMM DD, YYYY"
                    clearable
                    withAsterisk
                    maxDate={new Date()}
                    key={submitForm.key("date")}
                    {...submitForm.getInputProps("date")}
                    styles={{
                      input: {
                        borderColor: "#0e3557",
                      },
                    }}
                  />
                </div>
                <div className="w-full">
                  <TimeInput
                    description="Time"
                    value={timeValue}
                    onChange={(event) =>
                      setTimeValue(event.currentTarget.value)
                    }
                    labelProps={{ fw: 300 }}
                    withAsterisk
                    key={submitForm.key("time")}
                    {...submitForm.getInputProps("time")}
                    styles={{
                      input: {
                        borderColor: "#0e3557",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
          <section id="details-section">
            <SectionHeader HeaderName={"Document/paper details"} />
            <div className="flex flex-row justify-start px-10 py-2">
              <div className="w-full">
                <Text size="sm" fw={300} c="dimmed" pr={50}>
                  Title/Designation of the incoming documents/papers, attachment
                  of document(s), forwarding office and or person, nature of the
                  communications and received through any forms of courier.
                </Text>
              </div>
              <div className="flex flex-col w-full">
                <div className="w-full pb-10">
                  <Textarea
                    labelProps={{ fw: 300 }}
                    description="Description"
                    rows={6}
                    minRows={6}
                    maxRows={6}
                    withAsterisk
                    key={submitForm.key("description")}
                    {...submitForm.getInputProps("description")}
                    styles={{
                      input: {
                        borderColor: "#0e3557",
                      },
                    }}
                  />
                </div>
                <div className="w-full pb-10">
                  <Stack spacing="md">
                    <Dropzone
                      onDrop={handleDrop}
                      accept={PDF_MIME_TYPE}
                      maxSize={120 * 1024 ** 2} // 100 MB
                      multiple
                      style={{
                        background: "#c1c6ca",
                        opacity: !submitForm.values.code ? 0.5 : 1,
                        cursor: !submitForm.values.code
                          ? "not-allowed"
                          : "pointer",
                      }}
                      disabled={!submitForm.values.code}
                    >
                      <Group wrap="nowrap" justify="center" mih={150}>
                        <Dropzone.Idle>
                          <BsFiletypePdf size={36} stroke={1} />
                        </Dropzone.Idle>
                        <div>
                          <Flex direction="column" rowGap={5}>
                            <Text size="lg" inline>
                              Drag PDF file here or click to select files
                            </Text>
                            <Text size="xs" c="dimmed" inline mt={5}>
                              Attach as many files as you like, each file should
                              not exceed 120mb
                            </Text>
                            <Text
                              size="xs"
                              c="dimmed"
                              inline
                              mt={1}
                              fs="italic"
                            >
                              {filesAttached === 0
                                ? "No attachments"
                                : `${filesAttached} PDF ${
                                    filesAttached > 1 ? "files" : "file"
                                  } attached`}
                            </Text>
                          </Flex>
                        </div>
                      </Group>
                    </Dropzone>
                    <div>
                      <Text size="xs" c="dimmed" fw={300}>
                        Attachment(s):
                      </Text>
                    </div>
                    {files.length > 0 && (
                      <Stack className="px-5">
                        {files.map((file, index) => (
                          <Paper key={index} shadow="sm" p="xs" withBorder>
                            <Group justify="space-between">
                              <div className="flex flex-row justify-start items-center">
                                <BsFileEarmarkPdfFill
                                  size={22}
                                  stroke={1}
                                  className="text-amber-800"
                                />
                                <Text size="xs" fw={300} px={10}>
                                  {file.name}
                                </Text>
                              </div>
                              <CloseButton
                                onClick={() => {
                                  setFiles((prevFiles) => {
                                    const updated = prevFiles.filter(
                                      (_, i) => i !== index
                                    );
                                    setFilesAttached(updated.length); // update file count
                                    return updated;
                                  });
                                }}
                                aria-label="Remove file"
                              />
                            </Group>
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </div>
                <div className="w-full pb-5">
                  <TextInput
                    labelProps={{ fw: 300 }}
                    description="Forwarding office/person"
                    placeholder=""
                    withAsterisk
                    key={submitForm.key("forwardedBy")}
                    {...submitForm.getInputProps("forwardedBy")}
                    styles={{
                      input: {
                        borderColor: "#0e3557",
                      },
                    }}
                  />
                </div>
                <div className="w-full pb-5">
                  <Select
                    description="Nature of communication"
                    placeholder="Select"
                    clearable
                    checkIconPosition="left"
                    allowDeselect={false}
                    data={[
                      ...natureCommCodes.map((item) => ({
                        label: item.value,
                        value: item.id.toString(),
                      })),
                    ]}
                    withAsterisk
                    key={submitForm.key("natureOfComm")}
                    {...submitForm.getInputProps("natureOfComm")}
                    styles={{
                      input: {
                        borderColor: "#0e3557",
                      },
                    }}
                  />
                </div>
                <div className="w-full pb-10">
                  <Select
                    description="Received through"
                    placeholder="Select"
                    clearable
                    allowDeselect={false}
                    data={[
                      ...receivedThruCodes.map((item) => ({
                        label: item.value,
                        value: item.id.toString(),
                      })),
                    ]}
                    withAsterisk
                    key={submitForm.key("receivedThru")}
                    {...submitForm.getInputProps("receivedThru")}
                    styles={{
                      input: {
                        borderColor: "#0e3557",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </section>
        <section id="button-section" className="container mx-auto pt-10">
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
              Submit
            </Button>
          </Group>
        </section>
      </form>
    </main>
  );
};

export default Receiving;
