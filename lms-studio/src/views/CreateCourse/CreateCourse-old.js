import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Wizard from "@cloudscape-design/components/wizard";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Container from "@cloudscape-design/components/container";
import Modal from "@cloudscape-design/components/modal";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import Toggle from "@cloudscape-design/components/toggle";
import Box from "@cloudscape-design/components/box";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Cards from "@cloudscape-design/components/cards";
import TextFilter from "@cloudscape-design/components/text-filter";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import Footer from "../../components/Footer/Footer";
import { withAuthenticator } from "@aws-amplify/ui-react";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Applayout from "@cloudscape-design/components/app-layout";
import Icon from "@cloudscape-design/components/icon";
import { useNavigate } from "react-router-dom";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import { createElement } from "react";
// import {v4 as uuid} from uuid;
import { IoClose } from "react-icons/io5";
import { API } from "aws-amplify";
import "./Course.css";

class CreateCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    
  }
  componentDidMount() {
    const apiName = "lmsStudio";
    const path = "/lectures/public";

    API.get(apiName, path)
      .then((response) => {
        this.setState({ existingLectures: response });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  // createCourseSubmission = () => {
  //   const apiName = 'lmsStudio';
  //   const path = '/courses';
  //   const jsonData = {
  //     "ID": "SAA",
  //     "Categories": [
  //      "Networking",
  //      "Storage"
  //     ],
  //     "Chapters": [
  //      {
  //       "lectures": [
  //        {
  //         "lectureId": "course-intro-aws-fundamental",
  //         "length": 200,
  //         "name": "What is AWS?",
  //         "type": "video"
  //        },
  //        {
  //         "lectureId": "aws-account",
  //         "length": 95,
  //         "name": "Create AWS account",
  //         "type": "lab"
  //        }
  //       ],
  //       "name": "Introduction"
  //      },
  //      {
  //       "lectures": [
  //        {
  //         "lectureId": "ec2",
  //         "length": 15,
  //         "name": "EC2 introduction",
  //         "type": "video"
  //        },
  //        {
  //         "lectureId": "ec2-deep-dive",
  //         "length": 15,
  //         "name": "EC2 deep dive",
  //         "type": "video"
  //        },
  //        {
  //         "lectureId": "s3",
  //         "length": 15,
  //         "name": "Amazon S3 introduction",
  //         "type": "video"
  //        }
  //       ],
  //       "name": "Compute Services"
  //      }
  //     ],
  //     "Description": "In this lab, users will programmatically deploy Cisco Secure Firewall Threat Defence (FTDv) and Firewall Management Center (FMC) using Infrastructure as Code (Terraform). The firewalls will be placed behind a network load balancer. User will also programmatically configure the firewalls once onboarded to ensure it allows required traffic flow from internet to the test machine setup in the AWS environment.",
  //     "Last Updated": 1686760629,
  //     "Length": 15,
  //     "Level": "300",
  //     "Name": "AWS Solution Architect Associate",
  //     "Requirements": this.state.requirements,
  //     "Tags": [
  //      "EC2",
  //      "Marketplace"
  //     ],
  //     "Difficulty: this.state.difficulty,
  //     "WhatToLearn": [
  //      "FULLY UPDATED FOR ANS-C00: Pass the AWS Certified Networking Specialty Certification",
  //      "Learn networking on AWS in depth",
  //      "All 700+ slides available as downloadable PDF",
  //      "Practice alongside several advanced hands-on"
  //     ]
  //    }
  //   API.put(apiName, path, { body: jsonData })
  //       .then((response) => {
  //           console.log(`TODO: handle submission response. ID: ${response.ID}`)
  //       })
  //       .catch((error) => {
  //           console.log(error.response);
  //       });
  // }
  draggedItem123
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
        items: [],
      },
      existingLectures: [],
      chapters: [],
      visible: false,
      selectedLectures: [],
      currentPageIndex: 1
    };
  };

  deleteRequirement = (index) => {
    let list = [...this.state.requirements]
    list.splice(index, 1);
    this.setState({requirements: list})
  }

  deleteLecture = (cIndex, index) => {
    let chapterList = [...this.state.chapters];
    chapterList[cIndex].items.splice(index, 1);
    this.setState({chapters: chapterList})
  }
  renderRequirements = () => {
    return (
      // <ul>
      //   { this.state.requirements.map((item, index) => <li key={index}>{item}</li>)}
      // </ul>
      <>
        {this.state.requirements.map((item, index) => (
          <div className="requirement-item">
            <li className="requirement-item-haft" key={index}>
              {item}
            </li>
            <div
              className="requirement-item-haft"
              style={{ textAlign: "right"}}
              onClick={(e) => this.deleteRequirement(index)}
            >
              <Icon name="close" size="inherit" />
            </div>
          </div>
        ))}
      </>
    );
  };

  
  onDragLectureStart = (e, cIndex, index) => {
    console.log(this)
    this.draggedItem = this.state.chapters[cIndex].items[index];
    e.dataTransfer.effectAllowed = "move";
    // e.dataTransfer.setData("text/html", e.target.parentNode);
    // e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  onDragLectureOver = (cIndex, index) => {
    const draggedOverItem = this.state.chapters[cIndex].items[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let items = this.state.chapters[cIndex].items.filter(item => item !== this.draggedItem);
    console.log("item1", items)
    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);
    console.log("item2", items)
    // set updated items for chapters
    let chapterList = this.state.chapters;
    chapterList[cIndex].items = items;
    this.setState({ chapters: chapterList})
  };

  onDragLectureEnd = () => {
    this.draggedIdx = null;
  };
  
  renderChapters = () => {
    return (
      <div className="lecture-list">
        <SpaceBetween size="xs">
        {this.state.chapters.map((chapter, cIndex) => (
          <ExpandableSection
            key={cIndex}
            headerText={chapter.name}
            variant="container"
            headerActions={<Button>Edit</Button>}
          >
            <ul>
              {chapter.items.map((item, index) => (
                <li key={index} 
                  draggable 
                  onDragStart={e => this.onDragLectureStart(e, cIndex, index)}
                  onDragEnd={this.onDragLectureEnd}
                  onDragOver={() => this.onDragLectureOver(cIndex, index)}
                >
                  {item.name}
                  <Icon name="close" size="inherit" />
                </li>
              ))}
            </ul>
          </ExpandableSection>
        ))}
        </SpaceBetween>
      </div>
    );
  };
  render = () => {
    return (
      <>
        <NavBar navigation={this.props.navigation} title="Cloud Academy" />
        <div className="dashboard-main">
          <div>
            <Outlet />
            <div style={{ paddingLeft: 20 }}>
              <BreadcrumbGroup
                items={[
                  { text: "Home", href: "#" },
                  { text: "Course Management", href: "#components" },
                ]}
                ariaLabel="Breadcrumbs"
              />
            </div>
            <div className="dashboard-main" style={{ padding: "0 20px" }}>
              <Outlet />
              <Wizard
                i18nStrings={{
                  stepNumberLabel: (stepNumber) => `Step ${stepNumber}`,
                  collapsedStepsLabel: (stepNumber, stepsCount) =>
                    `Step ${stepNumber} of ${stepsCount}`,
                  skipToButtonLabel: (step, stepNumber) =>
                    `Skip to ${step.title}`,
                  navigationAriaLabel: "Steps",
                  cancelButton: "Cancel",
                  previousButton: "Previous",
                  nextButton: "Next",
                  submitButton: "Create course",
                  optional: "optional",
                }}
                onSubmit={() => console.log(this.state)}
                onNavigate={({ detail }) =>
                  this.setState({ activeStepIndex: detail.requestedStepIndex })
                }
                activeStepIndex={this.state.activeStepIndex}
                steps={[
                  {
                    title: "Add Course Detail",
                    content: (
                      <Container
                        header={<Header variant="h2">Add Course Detail</Header>}
                      >
                        <SpaceBetween direction="vertical" size="l">
                          <FormField label="Course Title">
                            <Input
                              value={this.state.name}
                              onChange={(event) =>
                                this.setState({ name: event.detail.value })
                              }
                            />
                          </FormField>
                          <FormField label="Course Description">
                            <Input
                              value={this.state.description}
                              onChange={(event) =>
                                this.setState({
                                  description: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                        </SpaceBetween>
                        <p>
                          <strong>Course Publicity</strong>
                        </p>
                        <Toggle
                          onChange={({ detail }) =>
                            this.setState({ publicity: detail.checked })
                          }
                          checked={this.state.publicity}
                        >
                          Public Course
                        </Toggle>
                        <p>
                          <strong>Course Difficulty</strong>
                        </p>
                        <Toggle
                          onChange={({ detail }) =>
                            this.setState({ difficulty: detail.checked })
                          }
                          checked={this.state.difficulty}
                        >
                          Flexible
                        </Toggle>
                      </Container>
                    ),
                  },
                  {
                    title: "Add requirements",
                    content: (
                      <Container
                        header={<Header variant="h2">Requirements</Header>}
                      >
                        <SpaceBetween direction="vertical" size="l">
                          <FormField label="Requirement">
                            <Input
                              value={this.state.currentRequirement}
                              onChange={(event) =>
                                this.setState({
                                  currentRequirement: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <Button
                            variant="primary"
                            onClick={() => {
                              this.setState({
                                requirements: [
                                  ...this.state.requirements,
                                  this.state.currentRequirement,
                                ],
                              });
                              this.setState({ currentRequirement: "" });
                            }}
                          >
                            Add requirements
                          </Button>
                          <ColumnLayout columns={2} variant="text-grid">
                            {this.renderRequirements()}
                          </ColumnLayout>
                        </SpaceBetween>
                      </Container>
                    ),
                    isOptional: false,
                  },
                  {
                    title: "Add Chapter",
                    content: (
                      <>
                        <SpaceBetween direction="vertical" size="l">
                          <Container
                            header={<Header variant="h2">Chapter</Header>}
                          >
                            <SpaceBetween direction="vertical" size="l">
                              <FormField label="Chapter Name">
                                <Input
                                  value={this.state.currentChapter.name}
                                  onChange={(event) =>
                                    this.setState({
                                      currentChapter: {
                                        name: event.detail.value,
                                        items: this.state.currentChapter.items,
                                      },
                                    })
                                  }
                                />
                              </FormField>
                              <Button
                                variant="primary"
                                onClick={() => this.setState({ visible: true })}
                              >
                                Add
                              </Button>

                              <ColumnLayout columns={1} variant="text-grid">
                                {this.renderChapters()}
                              </ColumnLayout>

                              <Modal
                                onDismiss={() =>
                                  this.setState({ visible: false })
                                }
                                visible={this.state.visible}
                                size="max"
                                footer={
                                  <Box float="right">
                                    <SpaceBetween
                                      direction="horizontal"
                                      size="xs"
                                    >
                                      <Button
                                        variant="link"
                                        onClick={() => {
                                          const selectedLecturesSize =
                                            this.state.selectedLectures.length;
                                          this.setState({
                                            selectedLectures: [],
                                            currentChapter: {
                                              name: this.state.currentChapter.name,
                                              items:
                                                this.state.currentChapter.items.slice(
                                                  0,
                                                  this.state.currentChapter.items.length - selectedLecturesSize
                                                ),
                                            },
                                          });
                                          this.setState({ visible: false });
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        onClick={() => {
                                          const newlySelectedLectures =
                                            this.state.selectedLectures.map(
                                              (lecture) => {
                                                return {
                                                  type: lecture.Type,
                                                  name: lecture.Name,
                                                  lectureId: lecture.ID,
                                                  length: lecture.Length
                                                };
                                              }
                                            );
                                          const updatedCurrChapter = {
                                            name: this.state.currentChapter.name,
                                            items:
                                              this.state.currentChapter.items.concat(
                                                newlySelectedLectures
                                              ),
                                          };
                                          this.setState({
                                            selectedLectures: [],
                                            currentChapter: {
                                              name: "",
                                              items: [],
                                            },
                                            chapters: [
                                              ...this.state.chapters,
                                              updatedCurrChapter,
                                            ],
                                            visible: false,
                                          });
                                        }}
                                      >
                                        Ok
                                      </Button>
                                    </SpaceBetween>
                                  </Box>
                                }
                                header="Add Chapter"
                              >
                                <Cards
                                  onSelectionChange={({ detail }) => {
                                    this.setState({
                                      selectedLectures: detail.selectedItems,
                                    });
                                  }}
                                  selectedItems={this.state.selectedLectures}
                                  ariaLabels={{
                                    itemSelectionLabel: (e, n) =>
                                      `select ${n.Name}`,
                                    selectionGroupLabel: "Item selection",
                                  }}
                                  cardDefinition={{
                                    header: (e) => e.Name,
                                    sections: [
                                      {
                                        id: "description",
                                        header: "Description",
                                        content: (e) => e.Desc,
                                      },
                                      {
                                        id: "type",
                                        header: "Type",
                                        content: (e) => e.Type,
                                      },
                                      {
                                        id: "size",
                                        header: "Size",
                                        content: (e) => "-",
                                      },
                                    ],
                                  }}
                                  cardsPerRow={[
                                    { cards: 1 },
                                    { minWidth: 500, cards: 2 },
                                  ]}
                                  items={this.state.existingLectures}
                                  loadingText="Loading resources"
                                  selectionType="multi"
                                  trackBy="Name"
                                  visibleSections={[
                                    "description",
                                    "type",
                                    "size",
                                  ]}
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
                                    <TextFilter filteringPlaceholder="Find lectures" 
                                    />
                                  }
                                  header={
                                    <Header
                                      counter={
                                        this.state.selectedLectures.length
                                          ? "(" +
                                            this.state.selectedLectures.length +
                                            "/10)"
                                          : "(10)"
                                      }
                                    >
                                      Add lecture
                                    </Header>
                                  }
                                  pagination={
                                    <Pagination
                                      currentPageIndex={this.state.currentPageIndex}
                                      onChange={({ detail }) =>
                                        this.setState({currentPageIndex: detail.currentPageIndex})
                                      }
                                      pagesCount={10}
                                    />
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
                                          "size",
                                        ],
                                      }}
                                      pageSizePreference={{
                                        title: "Page size",
                                        options: [
                                          { value: 6, label: "6 resources" },
                                          { value: 12, label: "12 resources" },
                                        ],
                                      }}
                                      visibleContentPreference={{
                                        title: "Select visible content",
                                        options: [
                                          {
                                            label:
                                              "Main distribution properties",
                                            options: [
                                              {
                                                id: "description",
                                                label: "Description",
                                              },
                                              { id: "type", label: "Type" },
                                              { id: "size", label: "Size" },
                                            ],
                                          },
                                        ],
                                      }}
                                    />
                                  }
                                />
                              </Modal>
                            </SpaceBetween>
                          </Container>
                          <div style={{ textAlign: "center" }}>
                            <Button
                              variant="primary"
                              onClick={() => this.setState({ visible: true })}
                            >
                              Add chapter
                            </Button>
                          </div>
                        </SpaceBetween>
                      </>
                    ),
                    isOptional: false,
                  },
                  {
                    title: "Review and launch",
                    content: (
                      <div>
                        <SpaceBetween size="xs">
                          <Header
                            variant="h3"
                            actions={
                              <Button
                                onClick={() =>
                                  this.setState({ activeStepIndex: 0 })
                                }
                              >
                                Edit
                              </Button>
                            }
                          >
                            Step 1: Add Course Detail
                          </Header>
                          <Container
                            header={<Header variant="h2">Course Detail</Header>}
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
                                <div>{this.state.publicity ? "yes" : "no"}</div>
                              </div>
                              <div>
                                <Box variant="awsui-key-label">
                                  Course Difficulty
                                </Box>
                                <div>
                                  {this.state.difficulty ? "yes" : "no"}
                                </div>
                              </div>
                            </ColumnLayout>
                          </Container>
                        </SpaceBetween>

                        <SpaceBetween size="xs">
                          <Header variant="h3">Step 2: Add Requirements</Header>
                          <Container
                            header={<Header variant="h2">Requirement</Header>}
                          >
                            <ColumnLayout columns={4} variant="text-grid">
                              <div>
                                <Box variant="awsui-key-label">
                                  Requirements
                                </Box>
                                <div>
                                  <ol>{this.renderRequirements()}</ol>
                                </div>
                              </div>
                            </ColumnLayout>
                          </Container>
                        </SpaceBetween>
                        <SpaceBetween size="xs">
                          <Header>Step 3: Add Chapter</Header>
                          <Container
                            header={<Header variant="h2">Course Detail</Header>}
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
          <Footer />
        </div>
      </>
    );
  };
}

export default withAuthenticator(CreateCourse);
