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
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import { createElement } from 'react';

class CreateCourse extends React.Component {
  constructor(props) {
      super(props);
      this.state = this.getDefaultState();
  }

  getDefaultState = () => {
    return {
        activeHref: "/",
        activeStepIndex: 0,
        name: "",
        description: "",
        publicity: false,
        difficulty: false,
        currentRequirement: "",
        requirements: [],
        currentChapter: {
          name: "",
          items: []
        },
        existingLectures: [
          {
            lectureTitle: "SAA Video",
            lectureDescription: "Solution Architect Associate - Lecture Video",
            lectureType: "Video",
            lectureVideoS3Key: "saa.mp4",
            workshopUrl: "",
            workshopDescription: "",
            architectureDiagramS3Key: "",
            quizS3Key: ""
          },
          {
            lectureTitle: "SAA Workshop",
            lectureDescription: "Solution Architect Associate - Workshop",
            lectureType: "Workshop",
            lectureVideoS3Key: "",
            workshopUrl: "https://saa.workshop.amazonaws.com/",
            workshopDescription: "SAA workshop v1.0",
            architectureDiagramS3Key: "saa-architecture.png",
            quizS3Key: ""
          },
          {
            lectureTitle: "SAA Quiz",
            lectureDescription: "Solution Architect Associate - Quiz",
            lectureType: "Quiz",
            lectureVideoS3Key: "",
            workshopUrl: "",
            workshopDescription: "",
            architectureDiagramS3Key: "",
            quizS3Key: "saa-quiz.json"
          }
        ],
        chapters: [],
        visible: false,
        selectedLectures: []
    }
  }

  renderRequirements = () => {
    return (
      <ul>
        { this.state.requirements.map((item, index) => <li key={index}>{item}</li>)}
      </ul>);
  }

  renderChapters = () => {
    return (<div>
      {this.state.chapters.map((chapter, cIndex) =>
      <ExpandableSection key={cIndex} headerText={chapter.name}>
      <ul>
      { chapter.items.map((item, index) => <li key={index}>{item.value}</li>)}
      </ul>
    </ExpandableSection>
    )}
    </div>)
  }

  render = () => {
    
  return (
    <>
      <NavBar navigation={this.props.navigation} title="Cloud Academy" />
      <div className="dashboard-main">
        <Applayout
          navigation={
            <SideNavigation
              activeHref={this.state.activeHref}
              header={{ href: "/", text: "Management" }}
              onFollow={(event) => {
                if (!event.detail.external) {
                  event.preventDefault();
                  const href =
                    event.detail.href === "/"
                      ? "myLectures"
                      : event.detail.href;
                  this.setState({activeHref: href});
                  this.navigate(`/management/${href}`);
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
                    this.setState({activeStepIndex: detail.requestedStepIndex})
                  }
                  activeStepIndex={this.state.activeStepIndex}
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
                              <Input value={this.state.name}
                              onChange={event => this.setState({ name: event.detail.value })}/>
                            </FormField>
                            <FormField label="Course Description">
                              <Input value={this.state.description}
                              onChange={event => this.setState({ description: event.detail.value })} />
                            </FormField>
                          </SpaceBetween>
                            <p><strong>Course Publicity</strong></p>
                            <Toggle
                              onChange={({ detail }) =>
                                this.setState({publicity: detail.checked})
                              }
                              checked={this.state.publicity}
                            >
                              Public Course
                            </Toggle>
                            <p><strong>Course Difficulty</strong></p>
                            <Toggle
                              onChange={({ detail }) =>
                                this.setState({difficulty: detail.checked})
                              }
                              checked={this.state.difficulty}
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
                            <FormField label="Requirement">
                              <Input  value={this.state.currentRequirement}
                              onChange={event => this.setState({ currentRequirement: event.detail.value })}/>
                            </FormField>
                          </SpaceBetween>
                          <Button variant="primary" onClick={() => {
                            this.setState({
                              requirements: [...this.state.requirements, this.state.currentRequirement]});
                            this.setState({currentRequirement: ""});
                          }}>Add requirements</Button>
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
                              <Input value={this.state.currentChapter.name}
                              onChange={event => this.setState({ currentChapter: {
                                name: event.detail.value,
                                items: this.state.currentChapter.items
                              } })}/>
                            </FormField>
                          </SpaceBetween>
                          <Button variant="primary" onClick={() => this.setState({visible: true})}>Add lectures</Button>
                          <Modal
                            onDismiss={() => this.setState({visible: false})}
                            visible={this.state.visible}
                            size="max"
                            footer={
                              <Box float="right">
                                <SpaceBetween direction="horizontal" size="xs">
                                  <Button variant="link" onClick={() => {
                                    const selectedLecturesSize = this.state.selectedLectures.length;
                                    this.setState({
                                      selectedLectures: [],
                                      currentChapter: {
                                      name: this.state.currentChapter.name,
                                      items: this.state.currentChapter.items.slice(0, this.state.currentChapter.items.length - selectedLecturesSize)
                                    }})
                                    this.setState({visible: false})
                                  }}>Cancel</Button>
                                  <Button variant="primary" onClick={() =>{
                                    const newlySelectedLectures = this.state.selectedLectures.map((lecture) => {
                                      return {
                                        type: lecture.lectureType,
                                        value: lecture.lectureTitle
                                      }
                                    })
                                    const updatedCurrChapter = {
                                      name: this.state.currentChapter.name,
                                      items: this.state.currentChapter.items.concat(newlySelectedLectures)
                                    }
                                    this.setState({
                                      selectedLectures: [],
                                      currentChapter: {
                                        name: "",
                                        items: []
                                      },
                                      chapters: [...this.state.chapters, updatedCurrChapter],
                                      visible: false
                                    })
                                  }}>Ok</Button>
                                </SpaceBetween>
                              </Box>
                            }
                            header="Add Chapter"
                          >
                                <Cards
                                  onSelectionChange={({ detail }) =>
                                    {
                                      this.setState({selectedLectures: detail.selectedItems})
                                    }
                                  }
                                  selectedItems={this.state.selectedLectures}
                                  ariaLabels={{
                                    itemSelectionLabel: (e, n) => `select ${n.lectureTitle}`,
                                    selectionGroupLabel: "Item selection"
                                  }}
                                  cardDefinition={{
                                    header: e => e.lectureTitle,
                                    sections: [
                                      {
                                        id: "description",
                                        header: "Description",
                                        content: e => e.lectureDescription
                                      },
                                      {
                                        id: "type",
                                        header: "Type",
                                        content: e => e.lectureType
                                      },
                                      {
                                        id: "size",
                                        header: "Size",
                                        content: e => "-"
                                      }
                                    ]
                                  }}
                                  cardsPerRow={[
                                    { cards: 1 },
                                    { minWidth: 500, cards: 2 }
                                  ]}
                                  items={this.state.existingLectures}
                                  loadingText="Loading resources"
                                  selectionType="multi"
                                  trackBy="lectureTitle"
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
                                        this.state.selectedLectures.length
                                          ? "(" + this.state.selectedLectures.length + "/10)"
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
                        <div>
                        <SpaceBetween size="xs">
                          <Header
                            variant="h3"
                            actions={
                              <Button onClick={() => this.setState({activeStepIndex: 0})}>
                                Edit
                              </Button>
                            }
                          >
                            Step 1: Add Course Detail
                          </Header>
                          <Container
                            header={
                              <Header variant="h2">Course Detail</Header>
                            }
                          >
                            <ColumnLayout columns={4} variant="text-grid">
                              <div>
                                <Box variant="awsui-key-label">
                                  Course Title
                                </Box>
                                <div>{this.state.name}</div>
                              </div>
                              <div>
                                <Box variant="awsui-key-label">
                                  Course Description
                                </Box>
                                <div>{this.state.description}</div>
                              </div>
                              <div>
                                <Box variant="awsui-key-label">
                                  Course Publicity
                                </Box>
                                <div>{this.state.publicity ? 'yes' : 'no'}</div>
                              </div>
                              <div>
                                <Box variant="awsui-key-label">
                                  Course Difficulty
                                </Box>
                                <div>{this.state.difficulty? 'yes' : 'no'}</div>
                              </div>
                            </ColumnLayout>
                          </Container>
                        </SpaceBetween>

                        <SpaceBetween size="xs">
                          <Header
                            variant="h3"
                          >
                            Step 2: Add Requirements
                          </Header>
                          <Container
                            header={
                              <Header variant="h2">Requirement</Header>
                            }
                          >
                            <ColumnLayout columns={4} variant="text-grid">
                              <div>
                                <Box variant="awsui-key-label">
                                  Requirements
                                </Box>
                                <div>
                                <ol>
                                  { this.renderRequirements()}
                                </ol> 
                                </div>
                              </div>
                            </ColumnLayout>
                          </Container>
                        </SpaceBetween>
                        <SpaceBetween size="xs">
                          <Header
                            variant="h3"
                            actions={
                              <Button onClick={() => this.setState({activeStepIndex: 0})}>
                                Edit
                              </Button>
                            }
                          >
                            Step 3: Add Chapter
                          </Header>
                          <Container
                            header={
                              <Header variant="h2">Course Detail</Header>
                            }
                          >
                            <ColumnLayout columns={1} variant="text-grid">
                              {this.renderChapters()}
                            </ColumnLayout>
                          </Container>
                        </SpaceBetween>
                        </div>
                        
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
  }
}
// const CreateCourse = (props) => {
//   const [activeHref, setActiveHref] = useState("myCourses");
//   const navigate = useNavigate();
//   const [activeStepIndex, setActiveStepIndex] = React.useState(0);
//   const [checked, setChecked] = React.useState(false);
//   const [visible, setVisible] = React.useState(false);
//   const [selectedItems,setSelectedItems] = React.useState([{ name: "Item 2" }]);

// };

export default withAuthenticator(CreateCourse);