import { Button, Divider, Tabs, Tooltip } from "@mantine/core";
import React, { useEffect } from "react";
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

const Dashboard = () => {
  const dispatch = useDispatch();
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
  // const {
  //   data: processingData = [],
  //   isLoading: loadingProcessingData,
  //   isFetching: fetchingProcessingData,
  //   refetch: refetchProcessingData,
  // } = useGetProcessingDocumentListQuery();
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
            <Tabs.List p={10} ta={"left"} justify="start">
              <Tabs.Tab
                value="dashboard"
                p="sm"
                fw={500}
                w={120}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={refetch}
              >
                Documents
              </Tabs.Tab>
              <Tabs.Tab
                value="receiving"
                p="sm"
                fw={500}
                w={120}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
              >
                Receiving
              </Tabs.Tab>
              <Tabs.Tab
                value="processing"
                p="sm"
                fw={500}
                w={120}
                className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                onClick={() => {
                  activeUserRefetch();
                }}
              >
                Processing
              </Tabs.Tab>
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
                  p="sm"
                  fw={500}
                  w={120}
                  disabled
                  className="hover:ring-1 ring-[#0e3557] transition-all duration-300"
                >
                  Releasing
                </Tabs.Tab>
              </Tooltip>
            </Tabs.List>
            <Tabs.Panel p="md" value="dashboard">
              <div className="bg-gray-300 min-h-[80vh]">
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
                  userList={activeUserList ?? []}
                  userLoading={activeUsersLoading | activeUsersFetching}
                />
              </div>
            </Tabs.Panel>
            <Tabs.Panel p="md" value="releasing">
              <div className="bg-gray-300 min-h-[80vh]">
                Releasing tab content
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
