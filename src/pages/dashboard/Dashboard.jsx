import { Button, Divider, Tabs, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Receiving from "./form/Receiving";
import {
  useGetNatureOfCommunicationQuery,
  useGetReceivedThruQuery,
  useGetTitlesQuery,
  useGetDesignationQuery,
  useGetDocumentTypeQuery,
  useGetAccessLevelQuery,
} from "../../redux/endpoints/commonCodesEndpoint";
import {
  useGetDocumentListQuery,
  useGetProcessingDocumentListQuery,
  useGetForReleasingDocumentsQuery,
  useGetAssignedDocumentsQuery,
} from "../../redux/endpoints/documentsEndpoints";
import { useGetActiveUserListQuery } from "../../redux/endpoints/usersEndpoints";
import { useDispatch, useSelector } from "react-redux";
import {
  setNatureOfCommunication,
  setReceivedThrough,
  titles,
  designation,
  setDocumentTypes,
  setAccessLevel,
} from "../../redux/reducer/commonCodeReducer";
import DashForm from "./form/DashForm";
import Processing from "./form/Processing";
import {
  IoDocumentTextOutline,
  IoAddOutline,
  IoPeopleOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import { GoGear } from "react-icons/go";
import Releasing from "./form/Releasing";
import { getCommonCodeFieldValue } from "../../utilities/functions/func";
import ProcessingLawyers from "./form/ProcessingLawyers";
import { setUserList } from "../../redux/reducer/usersReducers";

const Dashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.auth?.authUser);
  const userId = auth?.userId;
  const userAccessLevel = auth?.accessLevel;

  const [disableReleasing, setDisableProcessing] = useState(false);
  const [filteredReleasedData, setFilteredReleasedData] = useState([]);
  const { data: titleList = [] } = useGetTitlesQuery();
  const { data: designationList = [] } = useGetDesignationQuery();
  const { data: natureOfCommunicationsList = [] } =
    useGetNatureOfCommunicationQuery();
  const { data: receivedThruList = [] } = useGetReceivedThruQuery();
  const {
    data: documentList = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetDocumentListQuery();
  const {
    data: processingData = [],
    isLoading: loadingProcessingData,
    isFetching: fetchingProcessingData,
    refetch: refetchProcessingData,
  } = useGetProcessingDocumentListQuery(1);
  const {
    data: activeUserList = [],
    isLoading: activeUsersLoading,
    isFetching: activeUsersFetching,
    refetch: activeUserRefetch,
  } = useGetActiveUserListQuery({
    status: "active",
  });
  const { data: documentTypes = [] } = useGetDocumentTypeQuery();
  const {
    data: releasingData = [],
    isLoading: releasedLoading,
    isFetching: releasedFetching,
    refetch: releasedRefetch,
  } = useGetForReleasingDocumentsQuery({ activePage: 1, userId });
  const { data: accessLevelList = [] } = useGetAccessLevelQuery();
  const {
    data: assignedDocs = [],
    isFetching: fetchingAssignedDocs,
    isLoading: loadingAssignedDocs,
    refetch: refetchAssignedDocs,
  } = useGetAssignedDocumentsQuery({ data: userId, page: 1 });

  const handleFilterReleasedData = () => {
    const getUser = releasingData?.result?.map((user) =>
      userId.contains(user.assignee)
    );
  };

  dispatch(setNatureOfCommunication(natureOfCommunicationsList));
  dispatch(setReceivedThrough(receivedThruList));
  dispatch(titles(titleList));
  dispatch(designation(designationList));
  dispatch(setDocumentTypes(documentTypes));
  dispatch(setAccessLevel(accessLevelList));
  dispatch(setUserList(activeUserList.result));

  const validateAccess = (value) => {
    const currentModules = getCommonCodeFieldValue(
      accessLevelList?.result,
      userAccessLevel
    );
    const arrModules = currentModules
      .split(",")
      .map((item) => item.trim().toLowerCase());
    return arrModules || [];
  };

  return (
    <main className="bg-secondary">
      <section className="container mx-auto py-8">
        <div className="min-h-[90vh] bg-white rounded-2xl shadow-xl justify-center items-center">
          <Tabs
            variant="pills"
            defaultValue="documents"
            orientation="horizontal"
            color="#0e3557"
            radius="xl"
            ta="left"
            p={10}
            style={{ boxShadow: "inherit" }}
          >
            <Tabs.List p={10} ta={"left"} justify="start" mx={5}>
              <Tabs.Tab
                value="documents"
                fw={500}
                w={140}
                leftSection={
                  <IoDocumentTextOutline size={20} strokeWidth={0.5} />
                }
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={refetch}
                hidden={!validateAccess().includes("documents")}
              >
                Documents
              </Tabs.Tab>
              <Tabs.Tab
                value="receiving"
                fw={500}
                w={140}
                leftSection={<IoAddOutline size={20} strokeWidth={0.5} />}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                hidden={!validateAccess().includes("receiving")}
              >
                Receiving
              </Tabs.Tab>
              <Tabs.Tab
                value="processing"
                fw={500}
                w={140}
                leftSection={<IoPeopleOutline size={20} strokeWidth={0.5} />}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={() => {
                  refetchProcessingData();
                  activeUserRefetch();
                }}
                hidden={!validateAccess().includes("processing")}
              >
                Processing
              </Tabs.Tab>
              <Tabs.Tab
                value="lawyers"
                fw={500}
                w={140}
                leftSection={<IoPeopleOutline size={20} strokeWidth={0.5} />}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={() => {
                  refetchAssignedDocs();
                }}
                hidden={!validateAccess().includes("lawyers")}
              >
                Processing
              </Tabs.Tab>
              <Tabs.Tab
                value="releasing"
                fw={500}
                w={140}
                leftSection={<IoDownloadOutline size={20} strokeWidth={0.5} />}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={releasedRefetch}
                hidden={!validateAccess().includes("releasing")}
              >
                Releasing
              </Tabs.Tab>
              <Tabs.Tab
                value="settings"
                fw={500}
                w={140}
                leftSection={<GoGear size={20} strokeWidth={0.5} />}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={() => {}}
                hidden={!validateAccess().includes("settings")}
              >
                Settings
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel p="md" value="documents">
              <div className="bg-gray-300 min-h-[80vh] rounded-2xl">
                <DashForm
                  data={documentList ?? []}
                  loading={isLoading | isFetching}
                />
              </div>
            </Tabs.Panel>
            <Tabs.Panel p="md" value="receiving">
              <div className="min-h-[80vh]">
                <Receiving />
              </div>
            </Tabs.Panel>
            <Tabs.Panel p="md" value="processing">
              <div className="bg-gray-300 min-h-[80vh]">
                <Processing
                  data={processingData}
                  loadingProcess={
                    loadingProcessingData | fetchingProcessingData
                  }
                  refetchDocuments={refetchProcessingData}
                  userList={activeUserList ?? []}
                  userLoading={activeUsersLoading | activeUsersFetching}
                />
              </div>
            </Tabs.Panel>
            <Tabs.Panel p="md" value="lawyers">
              <div className="bg-gray-300 min-h-[80vh] rounded-2xl">
                <ProcessingLawyers
                  documentList={assignedDocs}
                  isLoading={fetchingAssignedDocs | loadingAssignedDocs}
                  refetch={refetchAssignedDocs}
                />
              </div>
            </Tabs.Panel>
            <Tabs.Panel p="md" value="releasing">
              <div className="bg-gray-300 min-h-[80vh] rounded-2xl border-2 border-gray-400 p-4 border-dashed">
                <Releasing
                  releasingData={releasingData}
                  isLoading={releasedLoading | releasedFetching}
                  refetch={releasedRefetch}
                />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
