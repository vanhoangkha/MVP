import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Wizard from "@cloudscape-design/components/wizard";
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Container from '@cloudscape-design/components/container';
import Modal from "@cloudscape-design/components/modal";
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Button from '@cloudscape-design/components/button';
import Toggle from '@cloudscape-design/components/toggle';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Cards from "@cloudscape-design/components/cards";
import TextFilter from "@cloudscape-design/components/text-filter";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import Footer from "../../components/Footer/Footer";
import { withAuthenticator } from "@aws-amplify/ui-react";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Applayout from "@cloudscape-design/components/app-layout";
import { useNavigate } from "react-router-dom";
const CreateCourse = (props) => {
  const [activeHref, setActiveHref] = useState("myCourses");
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [checked, setChecked] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [selectedItems,setSelectedItems] = React.useState([{ name: "Item 2" }]);

  return (
    <>
      <NavBar navigation={props.navigation} title="Cloud Academy" />
      <div className="dashboard-main">
        <Applayout
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
            <div style={{ padding: 32 }}>
              <Outlet />
              <BreadcrumbGroup
                items={[
                  { text: 'Home', href: '#' },
                  { text: 'Course Management', href: '#components' },
                ]}
                ariaLabel="Breadcrumbs"
              />
              <div className="dashboard-main">
                <Outlet />
                <Wizard
                  i18nStrings={{
                    stepNumberLabel: (stepNumber) => `Step ${stepNumber}`,
                    collapsedStepsLabel: (stepNumber, stepsCount) =>
                      `Step ${stepNumber} of ${stepsCount}`,
                    skipToButtonLabel: (step, stepNumber) =>
                      `Skip to ${step.title}`,
                    navigationAriaLabel: 'Steps',
                    cancelButton: 'Cancel',
                    previousButton: 'Previous',
                    nextButton: 'Next',
                    submitButton: 'Create course',
                    optional: 'optional',
                  }}
                  onNavigate={({ detail }) =>
                    setActiveStepIndex(detail.requestedStepIndex)
                  }
                  activeStepIndex={activeStepIndex}
                  //allowSkipTo
                  steps={[
                    {
                      title: 'Add Course Detail',
                      //info: <Link variant="info">Info</Link>,
                      //description:
                      //  'Each instance type includes one or more instance sizes, allowing you to scale your resources to the requirements of your target workload.',
                      content: (
                        <Container
                          header={
                            <Header variant="h2">
                              Add Course Detail
                            </Header>
                          }
                        >
                          <SpaceBetween direction="vertical" size="l">
                            <FormField label="Course Title">
                              <Input />
                            </FormField>
                            <FormField label="Course Description">
                              <Input />
                            </FormField>
                          </SpaceBetween>
                            <p><strong>Course Publicity</strong></p>
                            <Toggle
                              onChange={({ detail }) =>
                                setChecked(detail.checked)
                              }
                              checked={checked}
                            >
                              Public Course
                            </Toggle>
                            <p><strong>Course Difficultyy</strong></p>
                            <Toggle
                              onChange={({ detail }) =>
                                setChecked(detail.checked)
                              }
                              checked={checked}
                            >
                              Flexible
                            </Toggle>
                        </Container>
                      ),
                    },
                    {
                      title: 'Add requirements',
                      content: (
                        <Container
                          header={
                            <Header variant="h2">
                            Requirements
                            </Header>
                          }
                        >
                          <SpaceBetween direction="vertical" size="l">
                            <FormField label="Requirement" id="requirements">
                              <Input />
                            </FormField>
                          </SpaceBetween>
                          <Button variant="primary">Add requirements</Button>
                        </Container>
                      ),
                      isOptional: false,
                    },
                    {
                      title: 'Add Chapter',
                      content: (
                        <Container
                          header={
                            <Header variant="h2">
                              Add Chapter
                            </Header>
                          }
                        >
                          <SpaceBetween direction="vertical" size="l">
                            <FormField label="Chapter Name">
                              <Input />
                            </FormField>
                          </SpaceBetween>
                          <Button variant="primary" onClick={() => setVisible(true)}>Add lectures</Button>
                          <Modal
                            onDismiss={() => setVisible(false)}
                            visible={visible}
                            size="max"
                            footer={
                              <Box float="right">
                                <SpaceBetween direction="horizontal" size="xs">
                                  <Button variant="link" onClick={() => setVisible(false)}>Cancel</Button>
                                  <Button variant="primary">Ok</Button>
                                </SpaceBetween>
                              </Box>
                            }
                            header="Add Chapter"
                          >
                                <Cards
                                  onSelectionChange={({ detail }) =>
                                    setSelectedItems(detail.selectedItems)
                                  }
                                  selectedItems={selectedItems}
                                  ariaLabels={{
                                    itemSelectionLabel: (e, n) => `select ${n.name}`,
                                    selectionGroupLabel: "Item selection"
                                  }}
                                  cardDefinition={{
                                    header: e => e.name,
                                    sections: [
                                      {
                                        id: "description",
                                        header: "Description",
                                        content: e => e.description
                                      },
                                      {
                                        id: "type",
                                        header: "Type",
                                        content: e => e.type
                                      },
                                      {
                                        id: "size",
                                        header: "Size",
                                        content: e => e.size
                                      }
                                    ]
                                  }}
                                  cardsPerRow={[
                                    { cards: 1 },
                                    { minWidth: 500, cards: 2 }
                                  ]}
                                  items={[
                                    {
                                      name: "Item 1",
                                      alt: "First",
                                      description: "This is the first item",
                                      type: "1A",
                                      size: "Small"
                                    },
                                    {
                                      name: "Item 2",
                                      alt: "Second",
                                      description: "This is the second item",
                                      type: "1B",
                                      size: "Large"
                                    },
                                    {
                                      name: "Item 3",
                                      alt: "Third",
                                      description: "This is the third item",
                                      type: "1A",
                                      size: "Large"
                                    },
                                    {
                                      name: "Item 4",
                                      alt: "Fourth",
                                      description: "This is the fourth item",
                                      type: "2A",
                                      size: "Small"
                                    },
                                    {
                                      name: "Item 5",
                                      alt: "Fifth",
                                      description: "This is the fifth item",
                                      type: "2A",
                                      size: "Large"
                                    },
                                    {
                                      name: "Item 6",
                                      alt: "Sixth",
                                      description: "This is the sixth item",
                                      type: "1A",
                                      size: "Small"
                                    }
                                  ]}
                                  loadingText="Loading resources"
                                  selectionType="multi"
                                  trackBy="name"
                                  visibleSections={["description", "type", "size"]}
                                  empty={
                                    <Box textAlign="center" color="inherit">
                                      <b>No resources</b>
                                      <Box
                                        padding={{ bottom: "s" }}
                                        variant="p"
                                        color="inherit"
                                      >
                                        No resources to display.
                                      </Box>
                                      <Button>Create resource</Button>
                                    </Box>
                                  }
                                  filter={
                                    <TextFilter filteringPlaceholder="Find lectures" />
                                  }
                                  header={
                                    <Header
                                      counter={
                                        selectedItems.length
                                          ? "(" + selectedItems.length + "/10)"
                                          : "(10)"
                                      }
                                    >
                                      Add lecture
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
                                        pageSize: 6,
                                        visibleContent: [
                                          "description",
                                          "type",
                                          "size"
                                        ]
                                      }}
                                      pageSizePreference={{
                                        title: "Page size",
                                        options: [
                                          { value: 6, label: "6 resources" },
                                          { value: 12, label: "12 resources" }
                                        ]
                                      }}
                                      visibleContentPreference={{
                                        title: "Select visible content",
                                        options: [
                                          {
                                            label: "Main distribution properties",
                                            options: [
                                              {
                                                id: "description",
                                                label: "Description"
                                              },
                                              { id: "type", label: "Type" },
                                              { id: "size", label: "Size" }
                                            ]
                                          }
                                        ]
                                      }}
                                    />
                                  }
                                />
                          </Modal>
                        </Container>
                      ),
                      isOptional: false,
                    },
                    {
                      title: 'Review and launch',
                      content: (
                        <SpaceBetween size="xs">
                          <Header
                            variant="h3"
                            actions={
                              <Button onClick={() => setActiveStepIndex(0)}>
                                Edit
                              </Button>
                            }
                          >
                            Step 1: Instance type
                          </Header>
                          <Container
                            header={
                              <Header variant="h2">Container title</Header>
                            }
                          >
                            <ColumnLayout columns={2} variant="text-grid">
                              <div>
                                <Box variant="awsui-key-label">
                                  First field
                                </Box>
                                <div>Value</div>
                              </div>
                              <div>
                                <Box variant="awsui-key-label">
                                  Second Field
                                </Box>
                                <div>Value</div>
                              </div>
                            </ColumnLayout>
                          </Container>
                        </SpaceBetween>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          }
        />
        <Footer />
      </div>
    </>
  );
};
export default CreateCourse;