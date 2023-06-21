import React, { useState } from "react";
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
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box variant="awsui-key-label">{label}</Box>
    <div>{children}</div>
  </div>
);

const AssignCourse = (props) => {
  const [activeHref, setActiveHref] = useState("myLectures");
  const [checked, setChecked] = useState(false);
  const [oppValue, setOppValue] = useState("");
  const [selectedUers, setSelectedUsers] = useState([{}]);
  const navigate = useNavigate();
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
              <Container
                header={<Header headingTagOverride="h3">Course Detail</Header>}
              >
                <ColumnLayout columns={3} variant="text-grid">
                  <SpaceBetween size="l">
                    <ValueWithLabel label="Course title">Value</ValueWithLabel>
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
                      <Input>
                        {" "}
                        onChange={({ detail }) =>
                          setOppValue(detail.value)
                        }{" "}
                        value={oppValue}
                      </Input>
                    </ValueWithLabel>
                  </SpaceBetween>
                  <SpaceBetween size="l">
                    <ValueWithLabel label="Owner">Value</ValueWithLabel>
                  </SpaceBetween>
                </ColumnLayout>
              </Container>
            </div>
          }
        />
        <Footer />
      </div>
    </>
  );
};

export default AssignCourse;
