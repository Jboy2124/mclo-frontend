import { Button, Divider, Tabs, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Receiving from "./form/Receiving";
import {
  useGetNatureOfCommunicationQuery,
  useGetReceivedThruQuery,
  useGetTitlesQuery,
  useGetDesignationQuery,
  useGetDocumentTypeQuery,
} from "../../redux/endpoints/commonCodesEndpoint";
import {
  useGetDocumentListQuery,
  useGetProcessingDocumentListQuery,
} from "../../redux/endpoints/documentsEndpoints";
import { useGetActiveUserListQuery } from "../../redux/endpoints/usersEndpoints";
import { useDispatch } from "react-redux";
import {
  setNatureOfCommunication,
  setReceivedThrough,
  titles,
  designation,
  setDocumentTypes,
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

const Dashboard = () => {
  const dispatch = useDispatch();
  const [disableReleasing, setDisableProcessing] = useState(false);
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

  dispatch(setNatureOfCommunication(natureOfCommunicationsList));
  dispatch(setReceivedThrough(receivedThruList));
  dispatch(titles(titleList));
  dispatch(designation(designationList));
  dispatch(setDocumentTypes(documentTypes));

  return (
    <main className="bg-secondary">
      <section className="container mx-auto py-8">
        <div className="min-h-[90vh] bg-white rounded-2xl shadow-xl justify-center items-center">
          <Tabs
            variant="pills"
            defaultValue="dashboard"
            orientation="horizontal"
            color="#0e3557"
            radius="xl"
            ta="left"
            p={10}
            style={{ boxShadow: "inherit" }}
          >
            <Tabs.List p={10} ta={"left"} justify="start" mx={5}>
              <Tabs.Tab
                value="dashboard"
                fw={500}
                w={140}
                leftSection={
                  <IoDocumentTextOutline size={20} strokeWidth={0.5} />
                }
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={refetch}
              >
                Documents
              </Tabs.Tab>
              <Tabs.Tab
                value="receiving"
                fw={500}
                w={140}
                leftSection={<IoAddOutline size={20} strokeWidth={0.5} />}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
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
              >
                Processing
              </Tabs.Tab>
              {disableReleasing && (
                <Tooltip
                  multiline
                  w={220}
                  withArrow
                  arrowSize={12}
                  transitionProps={{ duration: 200 }}
                  label="You have no access on this function."
                  color="orange"
                >
                  <Tabs.Tab
                    value="releasing"
                    fw={500}
                    w={140}
                    leftSection={
                      <IoDownloadOutline size={20} strokeWidth={0.5} />
                    }
                    disabled={disableReleasing}
                    className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                  >
                    Releasing
                  </Tabs.Tab>
                </Tooltip>
              )}
              {!disableReleasing && (
                <Tabs.Tab
                  value="releasing"
                  fw={500}
                  w={140}
                  leftSection={
                    <IoDownloadOutline size={20} strokeWidth={0.5} />
                  }
                  disabled={disableReleasing}
                  className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                >
                  Releasing
                </Tabs.Tab>
              )}
              <Tabs.Tab
                value="settings"
                fw={500}
                w={140}
                disabled
                leftSection={<GoGear size={20} strokeWidth={0.5} />}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={() => {}}
              >
                Settings
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel p="md" value="dashboard">
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
            <Tabs.Panel p="md" value="releasing">
              <div className="bg-gray-300 min-h-[80vh] rounded-2xl border-2 border-gray-400 p-4 border-dashed">
                <Releasing />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
