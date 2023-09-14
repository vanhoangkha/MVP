import React, { useState, useEffect } from "react";
import "./AssignCourse.css";
import {
  AppLayout,
  BreadcrumbGroup,
  SideNavigation,
  Container,
  Header,
  ColumnLayout,
  SpaceBetween,
  Toggle,
  Box,
  Input,
  Table,
  TextFilter,
  Pagination,
  CollectionPreferences,
  Button,
  Flashbar,
} from "@cloudscape-design/components";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from 'aws-amplify';
import NavBar from "../../../components/NavBar/NavBar";
import { apiName, userOverview, userCourse } from "../../../utils/api"
import Footer from "../../../components/Footer/Footer";

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box variant="awsui-key-label">{label}</Box>
    <div>{children}</div>
  </div>
);

const AssignCourse = (props) => {
  const [activeHref, setActiveHref] = useState("myLectures");
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ buttonLoad, setButtonLoad ] = useState(false);
  const [checked, setChecked] = useState(false);
  const [oppId, setOppId] = React.useState("");
  const [oppValue, setOppValue] = React.useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [ currentSelectedUsers, setCurrentSelectedUsers ] = useState([]);
  const navigate = useNavigate();
  const {state} = useLocation();
  // console.log("passed vars: " + JSON.stringify(prevState))


  const handlePutAssignCourse = async () => {
    if ( currentSelectedUsers === selectedUsers ) {
      return;
    }

    setButtonLoad(true)

    // Compare Assigned User
    var unassignedList = [];
    var assigedList = [];
    var userCourseArray = [];
    var deleteUserCourseArray = [];

    unassignedList = selectedUsers.filter(function (obj) {
      return currentSelectedUsers.indexOf(obj) == -1;
    });
    console.log(unassignedList);
    assigedList = currentSelectedUsers.filter(function (obj) {
      return selectedUsers.indexOf(obj) == -1;
    });
    console.log(assigedList)
    try {
      const staticData = {
        CourseID: state.ID,
        OppID: oppId,
        OppValue: oppValue,
        flexible: checked,
        Status: "ASSIGNED",
        CreatorID: state.CreatorID,
      };
      assigedList.forEach((user) => {
        if(user?.UserID){
          const dynamicData = { ...staticData, UserID: user.UserID };
          userCourseArray.push(dynamicData);
        }
      });
      await API.put(apiName, userCourse, { body: userCourseArray })

      userCourseArray = [];
      unassignedList.forEach((user) => {
        if(user?.UserID){
          const dynamicData = { CourseID: state.ID, UserID: user.UserID };
          deleteUserCourseArray.push(dynamicData);
        }
      });
      await API.del(apiName, userCourse, { body: deleteUserCourseArray });

      setItems([{
        type: "success",
        content: "Assign course successfully!",
        dismissible: true,
        dismissLabel: "Dismiss message",
        onDismiss: () => setItems([]),
      }])
      setButtonLoad(false);
      setSelectedUsers(currentSelectedUsers)
      setTimeout(() => setItems([]),3000)
    }catch(error) {
      console.error(error); // from creation or business logic
      setItems([{
        type: "error",
        content: "Error",
        dismissible: true,
        dismissLabel: "Dismiss message",
        onDismiss: () => setItems([]),
      }]) 
      setButtonLoad(false);
      setTimeout(() => setItems([]),3000)
    }
    
  }

  const getAllUser = async () => {
    setLoading(true)
    let userList = [];
    try {
      const userData = await API.get(apiName, userOverview);
      
      console.log(userData)
      userData.forEach((user) => {
        userList.push({
          UserID: user.Attributes[0].Value,
          email: user.Attributes[2].Value,
          name: user.Attributes[3].Value,
        });
      });
      setUsers(userList);

      const assignedUser = await API.get(apiName, userCourse + "/assigned/" + state.ID);
      console.log(assignedUser)
      setSelectedUsers(assignedUser);
      setCurrentSelectedUsers(assignedUser)
      setLoading(false);
    }
    catch(err){
      setLoading(false)
      console.log(err)
    }
  }

  useEffect(()=> {
    getAllUser();
  }, [])
    
    // business logic goes here
  return (
    <>
      {/* <NavBar navigation={props.navigation} title="Cloud Academy" /> */}
      <Flashbar items={items} />
      <div className="dashboard-main">
        {/* <AppLayout
          breadcrumbs={
            <BreadcrumbGroup
              items={[
                { text: "Home", href: "/management" },
                { text: "Course Assignment", href: "/assignCourse" },
              ]}
              ariaLabel="Breadcrumbs"
            />
          }
          navigation={
            <SideNavigation
              activeHref={activeHref}
              header={{ href: "/", text: "Management" }}
              onFollow={(event) => {
                if (!event.detail.external) {
                  event.preventDefault();
                  const href =
                    event.detail.href === "/"
                      ? "myLectures"
                      : event.detail.href;
                  setActiveHref(href);
                  navigate(`/management/${href}`);
                }
              }}
              items={[
                {
                  type: "section",
                  text: "Lectures",
                  items: [
                    {
                      type: "link",
                      text: "My Lectures",
                      href: "myLectures",
                    },
                    {
                      type: "link",
                      text: "Public Lectures",
                      href: "publicLectures",
                    },
                  ],
                },
                {
                  type: "section",
                  text: "Courses",
                  items: [
                    {
                      type: "link",
                      text: "My Courses",
                      href: "myCourses",
                    },
                    {
                      type: "link",
                      text: "Public Courses",
                      href: "publicCourses",
                    },
                    {
                      type: "link",
                      text: "Private Courses",
                      href: "privateCourses",
                    },
                  ],
                },
                { type: "link", text: "User", href: "user" },
                { type: "link", text: "Leaderboard", href: "leaderboard" },
              ]}
            />
          }
          content={
            <div>
              <br></br>
              <div>
                <Container
                  header={
                    <Header headingTagOverride="h3">Course Detail</Header>
                  }
                >
                  <ColumnLayout columns={3} variant="text-grid">
                    <SpaceBetween size="l">
                      <ValueWithLabel label="Course title">
                        {state.Name}
                      </ValueWithLabel>
                      <ValueWithLabel label="Course Difficulty">
                        <Toggle
                          onChange={({ detail }) => setChecked(detail.checked)}
                          checked={checked}
                        >
                          {" "}
                          Follow Order{" "}
                        </Toggle>
                      </ValueWithLabel>
                    </SpaceBetween>
                    <SpaceBetween size="l">
                      <ValueWithLabel label="Description">{state.Description}</ValueWithLabel>
                      <ValueWithLabel label="Opportunity ID">
                        <Input
                          onChange={({ detail }) => setOppId(detail.value)}
                          value={oppId}
                        />
                      </ValueWithLabel>
                    </SpaceBetween>
                    <SpaceBetween size="l">
                      <ValueWithLabel label="Owner">{state.CreatorID}</ValueWithLabel>
                      <ValueWithLabel label="Opportunity Value">
                        <Input
                          onChange={({ detail }) => setOppValue(detail.value)}
                          value={oppValue}
                        />
                      </ValueWithLabel>
                    </SpaceBetween>
                  </ColumnLayout>
                </Container>
              </div>
              <br></br>
              <div>
                <Table
                  onSelectionChange={({ detail }) =>
                    setSelectedUsers(detail.selectedItems)
                  }
                  selectedItems={selectedUsers}
                  ariaLabels={{
                    selectionGroupLabel: "Users selection",
                    allUsersSelectionLabel: ({ selectedUsers }) =>
                      `${selectedUsers.length} ${
                        selectedUsers.length === 1 ? "item" : "items"
                      } selected`,
                    userSelectionLabel: ({ selectedUsers }, item) => {
                      const isUserSelected = selectedUsers.filter(
                        (i) => i.name === item.name
                      ).length;
                      return `${item.name} is ${
                        isUserSelected ? "" : "not"
                      } selected`;
                    },
                  }}
                  columnDefinitions={[
                    {
                      id: "username",
                      header: "User Name",
                      cell: (e) => e.name,
                      sortingField: "name",
                      isRowHeader: true,
                    },
                  ]}
                  columnDisplay={[{ id: "username", visible: true }]}
                  items={[
                    {
                      name: "user1@amazon.com",
                      ID: "ap-southeast-1:2eda97e7-1bb8-4c4d-9484-f2a24be62312",
                    },
                    {
                      name: "user2@amazon.com",
                      ID: "ap-southeast-1:2eda97e7-1bb8-4c4d-9484-f2a24be62304",
                    },
                  ]}
                  loadingText="Loading users"
                  selectionType="multi"
                  trackBy="name"
                  empty={
                    <Box textAlign="center" color="inherit">
                      {" "}
                      <b>No users</b>{" "}
                      <Box
                        padding={{ bottom: "s" }}
                        variant="p"
                        color="inherit"
                      >
                        {" "}
                        No users to display.{" "}
                      </Box>{" "}
                    </Box>
                  }
                  filter={
                    <TextFilter
                      filteringPlaceholder="Find users"
                      filteringText=""
                    />
                  }
                  header={
                    <Header
                      counter={
                        selectedUsers.length
                          ? "(" + selectedUsers.length + "/10)"
                          : "(10)"
                      }
                    >
                      {" "}
                      List users{" "}
                    </Header>
                  }
                  pagination={
                    <Pagination currentPageIndex={1} pagesCount={2} />
                  }
                  preferences={
                    <CollectionPreferences
                      title="Preferences"
                      confirmLabel="Confirm"
                      cancelLabel="Cancel"
                      preferences={{
                        pageSize: 10,
                        contentDisplay: [{ id: "username", visible: true }],
                      }}
                      pageSizePreference={{
                        title: "Page size",
                        options: [
                          { value: 10, label: "10 resources" },
                          { value: 20, label: "20 resources" },
                        ],
                      }}
                      wrapLinesPreference={{}}
                      stripedRowsPreference={{}}
                      contentDensityPreference={{}}
                      contentDisplayPreference={{
                        options: [
                          {
                            id: "username",
                            label: "User name",
                            alwaysVisible: true,
                          },
                        ],
                      }}
                      stickyColumnsPreference={{
                        firstColumns: {
                          title: "Stick first column(s)",
                          description:
                            "Keep the first column(s) visible while horizontally scrolling the table content.",
                          options: [
                            { label: "None", value: 0 },
                            { label: "First column", value: 1 },
                            { label: "First two columns", value: 2 },
                          ],
                        },
                        lastColumns: {
                          title: "Stick last column",
                          description:
                            "Keep the last column visible while horizontally scrolling the table content.",
                          options: [
                            { label: "None", value: 0 },
                            { label: "Last column", value: 1 },
                          ],
                        },
                      }}
                    />
                  }
                />
              </div>
              <br></br>
              <div className="assigncourse-float-right">
                <SpaceBetween direction="horizontal" size="xs">
                  {" "}
                  <Button formAction="none" variant="link">
                    {" "}
                    Cancel{" "}
                  </Button>{" "}
                  <Button
                    disabled={!selectedUsers.length}
                    variant="primary"
                    onClick={() => handlePutAssignCourse()}
                  >
                    Assign
                  </Button>{" "}
                </SpaceBetween>
              </div>
              <br></br>
              <Flashbar items={items} />
            </div>
          }
        /> */}
        <div>
              <br></br>
              <div>
                <Container
                  header={
                    <Header headingTagOverride="h3">Course Detail</Header>
                  }
                >
                  <ColumnLayout columns={3} variant="text-grid">
                    <SpaceBetween size="l">
                      <ValueWithLabel label="Course title">
                        {state.Name}
                      </ValueWithLabel>
                      <ValueWithLabel label="Course Difficulty">
                        <Toggle
                          onChange={({ detail }) => setChecked(detail.checked)}
                          checked={checked}
                        >
                          {" "}
                          Follow Order{" "}
                        </Toggle>
                      </ValueWithLabel>
                    </SpaceBetween>
                    <SpaceBetween size="l">
                      <ValueWithLabel label="Description">{state.Description}</ValueWithLabel>
                      <ValueWithLabel label="Opportunity ID">
                        <Input
                          onChange={({ detail }) => setOppId(detail.value)}
                          value={oppId}
                        />
                      </ValueWithLabel>
                    </SpaceBetween>
                    <SpaceBetween size="l">
                      <ValueWithLabel label="Owner">{state.CreatorID}</ValueWithLabel>
                      <ValueWithLabel label="Opportunity Value">
                        <Input
                          onChange={({ detail }) => setOppValue(detail.value)}
                          value={oppValue}
                        />
                      </ValueWithLabel>
                    </SpaceBetween>
                  </ColumnLayout>
                </Container>
              </div>
              <br></br>
              <div>
                <Table
                  onSelectionChange={({ detail }) =>
                    setCurrentSelectedUsers(detail.selectedItems)
                  }
                  selectedItems={currentSelectedUsers}
                  ariaLabels={{
                    selectionGroupLabel: "Users selection",
                    allUsersSelectionLabel: ({ currentSelectedUsers }) =>
                      `${currentSelectedUsers.length} ${
                        currentSelectedUsers.length === 1 ? "item" : "items"
                      } selected`,
                    userSelectionLabel: ({ currentSelectedUsers }, item) => {
                      const isUserSelected = currentSelectedUsers.filter(
                        (i) => i.name === item.name
                      ).length;
                      return `${item.name} is ${
                        isUserSelected ? "" : "not"
                      } selected`;
                    },
                  }}
                  columnDefinitions={[
                    {
                      id: "UserID",
                      header: "User ID",
                      cell: (e) => e.UserID,
                      sortingField: "name",
                    },
                    {
                      id: "email",
                      header: "Email",
                      cell: (e) => e.email,
                      sortingField: "name",
                      isRowHeader: true,
                    },
                    {
                      id: "name",
                      header: "Name",
                      cell: (e) => e.name,
                      sortingField: "name",
                    },
                  ]}
                  columnDisplay={[
                    { id: "email", visible: true },
                    { id: "familyName", visible: true },
                    { id: "name", visible: true },
                  ]}
                  items={users}
                  loading={loading}
                  loadingText="Loading users"
                  selectionType="multi"
                  trackBy="UserID"
                  empty={
                    <Box textAlign="center" color="inherit">
                      {" "}
                      <b>No users</b>{" "}
                      <Box
                        padding={{ bottom: "s" }}
                        variant="p"
                        color="inherit"
                      >
                        {" "}
                        No users to display.{" "}
                      </Box>{" "}
                    </Box>
                  }
                  filter={
                    <TextFilter
                      filteringPlaceholder="Find users"
                      filteringText=""
                    />
                  }
                  header={
                    <Header
                      counter={
                        currentSelectedUsers.length
                          ? "(" + currentSelectedUsers.length + "/10)"
                          : "(10)"
                      }
                    >
                      {" "}
                      List users{" "}
                    </Header>
                  }
                  pagination={
                    <Pagination currentPageIndex={1} pagesCount={2} />
                  }
                  preferences={
                    <CollectionPreferences
                      title="Preferences"
                      confirmLabel="Confirm"
                      cancelLabel="Cancel"
                      preferences={{
                        pageSize: 10,
                        contentDisplay: [{ id: "username", visible: true }],
                      }}
                      pageSizePreference={{
                        title: "Page size",
                        options: [
                          { value: 10, label: "10 resources" },
                          { value: 20, label: "20 resources" },
                        ],
                      }}
                      wrapLinesPreference={{}}
                      stripedRowsPreference={{}}
                      contentDensityPreference={{}}
                      contentDisplayPreference={{
                        options: [
                          {
                            id: "username",
                            label: "User name",
                            alwaysVisible: true,
                          },
                        ],
                      }}
                      stickyColumnsPreference={{
                        firstColumns: {
                          title: "Stick first column(s)",
                          description:
                            "Keep the first column(s) visible while horizontally scrolling the table content.",
                          options: [
                            { label: "None", value: 0 },
                            { label: "First column", value: 1 },
                            { label: "First two columns", value: 2 },
                          ],
                        },
                        lastColumns: {
                          title: "Stick last column",
                          description:
                            "Keep the last column visible while horizontally scrolling the table content.",
                          options: [
                            { label: "None", value: 0 },
                            { label: "Last column", value: 1 },
                          ],
                        },
                      }}
                    />
                  }
                />
              </div>
              <br></br>
              <div className="assigncourse-float-right">
                <SpaceBetween direction="horizontal" size="xs">
                  {" "}
                  <Button formAction="none" variant="link">
                    {" "}
                    Cancel{" "}
                  </Button>{" "}
                  <Button
                    disabled={!currentSelectedUsers.length}
                    variant="primary"
                    onClick={() => handlePutAssignCourse()}
                    loading={buttonLoad}
                  >
                    Assign
                  </Button>{" "}
                </SpaceBetween>
              </div>
              <br></br>
            </div>
        <Footer />
      </div>
    </>
  );
};

export default AssignCourse;
