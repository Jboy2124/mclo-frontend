import { Box, Group, LoadingOverlay, Tooltip } from "@mantine/core";
import { openPdfInBrowser } from "../hooks/pdfViewer";

export const getCommonCodeFieldValue = (arr, code) => {
  if (arr) {
    const label = arr?.result?.find((val) => val.id === code)?.value;
    return label;
  }
  return "";
};

export const toggleLoading = (bool) => {
  if (bool) {
    <LoadingOverlay
      visible={bool}
      zIndex={250}
      overlayProps={{ radius: "sm", blur: 2 }}
      loaderProps={{ color: "blue", type: "bars" }}
    />;
  }
};

export const getDocumentStatus = (data, code) => {
  let docStatus = {
    active: 0,
    label: "Unknown",
  };
  const selectedData = data?.filter((data) => data.code_id === code);
  const receiving = selectedData[0]?.receiving;
  const processing = selectedData[0]?.processing;
  const releasing = selectedData[0]?.releasing;

  // Highest priority: Releasing
  if (releasing && releasing.releasingStatus === "For releasing") {
    docStatus = {
      active: 3,
      label: "Releasing",
    };
  }
  // Next priority: Processing
  else if (processing && processing.processStatus !== "Unassigned") {
    docStatus = {
      active: 2,
      label: "Processing",
    };
  }
  // Lowest priority: Receiving
  else if (receiving && receiving.status === "Received") {
    docStatus = {
      active: 1,
      label: "Receiving",
    };
  }

  return docStatus;
};

export const transformAttachments = (attachments) => {
  const attachmentList = attachments
    ? attachments
        .split(";")
        .map((path) => path.replace(/\\/g, "/"))
        .map((path) => path.replace("docs/JUL2025/", "")) // remove the prefix
    : [];

  return (
    <Group gap="xs">
      {attachmentList.map((file, index) => (
        <Tooltip key={index} label={file} color="dark" withArrow arrowSize={8}>
          <div
            key={index}
            className="w-[100px] h-[20px] rounded-full text-[11px] border px-2 truncate border-orange-400 bg-orange-200 hover:bg-orange-300 cursor-pointer"
            onClick={() => openPdfInBrowser(file)}
          >
            {file}
          </div>
        </Tooltip>
      ))}
    </Group>
  );
};
