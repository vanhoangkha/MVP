import React, { useState } from "react";
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
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import { putAssignCourseService } from "../services/assigncourse";

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box variant="awsui-key-label">{label}</Box>
    <div>{children}</div>
  </div>
);

const AssignCourse = (props) => {
  const [activeHref, setActiveHref] = useState("myLectures");
  const [checked, setChecked] = useState(false);
  const [oppId, setOppId] = React.useState("");
  const [oppValue, setOppValue] = React.useState("");
  const [selectedUsers, setSelectedUsers] = useState([{}]);
  const navigate = useNavigate();

  const handlePutAssignCourse = async (
    course,
    selectedUsers,
    oppId,
    oppValue,
    checked
  ) => {
    const staticData = {
      courseId: course.Id,
      oppId: oppId,
      oppValue: oppValue,
      flexible: checked,
      userStatus: "Assigned",
    };
    var userCourseArray = [];

    selectedUsers.forEach((user) => {
      const dynamicData = { ...staticData, user };
      userCourseArray.push(dynamicData);
    });
    try {
      const response = await putAssignCourseService(userCourseArray);

      console.log(response);
      // business logic goes here
    } catch (error) {
      console.error(error); // from creation or business logic
    }
  };
  return (
    <>
      <NavBar navigation={props.navigation} title="Cloud Academy" />
      <div className="dashboard-main">
        <AppLayout
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
                        Value
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
                      <ValueWithLabel label="Description">Value</ValueWithLabel>
                      <ValueWithLabel label="Opportunity ID">
                        <Input
                          onChange={({ detail }) => setOppId(detail.value)}
                          value={oppId}
                        />
                      </ValueWithLabel>
                    </SpaceBetween>
                    <SpaceBetween size="l">
                      <ValueWithLabel label="Owner">Value</ValueWithLabel>
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
                    },
                    {
                      name: "user2@amazon.com",
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
                    variant="primary"
                    //onClick={handlePutAssignCourse(
                    //  props.course,
                    //  selectedUsers,
                    //  oppId,
                    //  oppValue,
                    //  checked
                    //)}
                  >
                    Assign
                  </Button>{" "}
                </SpaceBetween>
              </div>
            </div>
          }
        />
        <Footer />
      </div>
    </>
  );
};

export default AssignCourse;
