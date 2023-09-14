import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import {
    BreadcrumbGroup,
    Wizard,
    FormField,
    Input,
    Container,
    Modal,
    Header,
    SpaceBetween,
    Button,
    Toggle,
    Box,
    ColumnLayout,
    Cards,
    TextFilter,
    Textarea,
    Alert,
    Pagination,
    CollectionPreferences,
    Flashbar,
} from "@cloudscape-design/components";
import { useCollection } from '@cloudscape-design/collection-hooks';
import Footer from "../../components/Footer/Footer";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Icon from "@cloudscape-design/components/icon";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import { API, Auth } from "aws-amplify";
import "./Course.css";

const successMes = "Created success";
const errorMess = "Error! An error occurred. Please try again later";

function EmptyState({ title, subtitle, action }) {
    return (
      <Box textAlign="center" color="inherit">
        <Box variant="strong" textAlign="center" color="inherit">
          {title}
        </Box>
        <Box variant="p" padding={{ bottom: 's' }} color="inherit">
          {subtitle}
        </Box>
        {action}
      </Box>
    );
  }

function CreateCourse(props) {
  const navigate  = useNavigate();

  const [state, setState] = useState({
    activeHref: "/",
    activeStepIndex: 0,
    name: "",
    description: "",
    categories: "",
    currentBenefit: "",
    whatToLearn: [],
    level: "",
    publicity: false,
    difficulty: false,
    length: 0,
    currentRequirement: "",
    requirements: [],
    currentChapter: {
      name: "",
      lectures: [],
    },
    existingLectures: [],
    chapters: [],
    visible: false,
    selectedLectures: [],
    editChapter: {
      index: -1,
      name: "",
      lectures: [],
    },
    submitStatus: 0,
    isLoadingNextStep: false,
    flashItem: [],
    userId: "",
  })
  const draggedItem = useRef(null)
  let draggedIdx;

  const [preferences, setPreferences] = useState({ pageSize: 6, visibleContent: ["description", "type", "size"] });
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    state.existingLectures,
    {
      filtering: {
        empty: <EmptyState title="No lectures" />,
        noMatch: (
          <EmptyState
            title="No matches"
            action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
          />
        ),
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: {},
      selection: {},
    }
  );

  useEffect(() => {
    const apiName = "lmsStudio";
    const path = "/lectures/public";

    API.get(apiName, path)
      .then((response) => {
        // console.log(response)
        setState({ ...state, existingLectures: response });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [])

  const loadUserId = async (callback) => {
    let credentials = await Auth.currentUserCredentials();
    setState(
      { ...state,
        userId: credentials.identityId,
      },
      callback
    );
  }

  const deleteRequirement = (index) => {
    let list = [...state.requirements]
    list.splice(index, 1);
    setState({...state, requirements: list})
  }

  const deleteBenefit = (index) => {
    let list = [...state.whatToLearn]
    list.splice(index, 1);
    setState({...state, whatToLearn: list})
  }

  const renderRequirements = () => {
    // console.log(state)
    // setState({...state, requirements: ["Một", "hai"]})
    return <>
        {state.requirements.map((item, index) => (
          <div className="requirement-item">
            <li className="requirement-item-haft" key={index}>
              {item}
            </li>
            <div
              className="requirement-item-haft"
              style={{ textAlign: "right"}}
              onClick={(e) => deleteRequirement(index)}
            >
              <Icon name="close" size="inherit" />
            </div>
          </div>
        ))}
      </>
  };

  const renderWhatToLearn = () => {
    // console.log(state)
    // setState({...state, requirements: ["Một", "hai"]})
    return <>
        {state.whatToLearn.map((item, index) => (
          <div className="requirement-item">
            <li className="requirement-item-haft" key={index}>
              {item}
            </li>
            <div
              className="requirement-item-haft"
              style={{ textAlign: "right"}}
              onClick={(e) => deleteBenefit(index)}
            >
              <Icon name="close" size="inherit" />
            </div>
          </div>
        ))}
      </>
  };


  const onDragLectureStart = (e, index) => {
    draggedItem.current = state.editChapter.lectures[index];
    e.dataTransfer.effectAllowed = "move";
    console.log("onDragLectureStart")
    // e.dataTransfer.setData("text/html", e.target.parentNode);
    // e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const onDragLectureOver = (e, index) => {
    const draggedOverItem = state.editChapter.lectures[index];

    // if the item is dragged over itself, ignore
    if (draggedItem.current === draggedOverItem || !draggedItem.current) {
      return;
    }

    // filter out the currently dragged item
    let items = state.editChapter.lectures.filter(item => item !== draggedItem.current);

    // add the dragged item after the dragged over item
    items.splice(index, 0, draggedItem.current);

    // set updated items for chapters
    let chapterList = state.editChapter;
    chapterList.lectures = items;
    setState({ ...state, editChapter: chapterList})
  };

  const onDragLectureEnd = () => {
    draggedIdx = null;
  };
  
  const editChapter = (e, cIndex) => {
    let chapter = state.chapters[cIndex];
    let selectedLectures = [];
    chapter.index = cIndex;
    for ( let i = 0; i < chapter.lectures.length; i++ ){
        selectedLectures.push({
            Name: chapter.lectures[i].name,
            ID: chapter.lectures[i].lectureId,
            Type: chapter.lectures[i].type,
            Length: chapter.lectures[i].length
        })
    }
    setState({ ...state, 
        editChapter: chapter,
        selectedLectures: selectedLectures,
    });
  }

  const saveEditChapter = () => {
    const existChapters = state.chapters;
    existChapters[state.editChapter.index] = state.editChapter
    setState({
        ...state,
        chapters: existChapters,
        editChapter: {
            index: -1,
            name: "",
            lectures: [],
        },
        selectedLectures: [],
    })
  }

  const deleteLecture = (index) => {
    let newEditChapter = state.editChapter
    let selectedLec = [...state.selectedLectures]
    newEditChapter.lectures.splice(index, 1);
    setState({...state, 
        editChapter: newEditChapter,
        selectedLectures: selectedLec.splice(index, 1),
    })
  }

  const updateLectureForChapter = () => {
    const newlySelectedLectures = state.selectedLectures.map((lecture) => {
      return {
        name: lecture.Name,
        lectureId: lecture.ID,
        type: lecture.Type,
        length: lecture.Length,
      };
    });
    

    if (state.editChapter.index === -1) {
      const updatedCurrChapter = {
        name: state.currentChapter.name,
        lectures: state.currentChapter.lectures.concat(newlySelectedLectures),
      };

      setState({
        ...state,
        selectedLectures: [],
        currentChapter: {
          name: "",
          lectures: [],
        },
        chapters: [...state.chapters, updatedCurrChapter],
        visible: false,
      });
    }else {
        setState({
            ...state,
            editChapter: {...state.editChapter, lectures: newlySelectedLectures},
            visible: false,
        })
    }
  };

  const convertNameToID = (name) => {
    const str_name = name.trim().toLowerCase();
    let id = str_name.replace(/ /g, "-");
    return id;
  }

  const submitCourse = async () => {
    setState({ ...state, isLoadingNextStep: true })

    let courseLength = 0;
    let categories = state.categories.split(",")
    state.chapters.map((chapter) => {
        chapter.lectures.map((lecture)=> {
            courseLength += lecture.length
        })
    })

    const jsonData = {
        ID: convertNameToID(state.name),
        Name: state.name.trim(),
        Description: state.description,
        Length: courseLength,
        Level: state.level,
        Categories: categories,
        Requirements: state.requirements,
        Difficulty: state.difficulty,
        Publicity: state.publicity ? 1 : 0,
        WhatToLearn: state.whatToLearn,
        Chapters: state.chapters,
        Views: 0,
    }

    const apiName = "lmsStudio";
    const path = "/courses";
    try {
      await API.post(apiName, path, { body: jsonData });
      setState({
        ...state,
        redirectToHome: true,
        isLoadingNextStep: false,
        flashItem: [
          {
            type: "success",
            content: successMes,
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setState({ ...state, flashItem: [] }),
            id: "success_message",
          },
        ],
      });
    } catch (error) {
      setState({
        ...state,
        isLoadingNextStep: false,
        flashItem: [
          {
            type: "error",
            content: errorMess,
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setState({ ...state, flashItem: [] }),
            id: "error_message",
          },
        ],
      });
    }
  }

  const backToCourseHome = () => {
    navigate(`/management/myCourses`)
  }

  const deleteChapter = () => {
    let newChapter = [...state.chapters];
    newChapter.splice(state.editChapter.index);
    setState({...state, chapters: newChapter})
  }

  const renderEditForm = () => {
    console.log(state.editChapter)
    return (
      <Container
        header={
          <Header
            variant="h2"
            description="Change information and items of chapter"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={saveEditChapter}>Save</Button>
                <Button onClick={deleteChapter}>Delete chapter</Button>
              </SpaceBetween>
            }
          >
            {state.editChapter.name}
          </Header>
        }
      >
        <SpaceBetween size="s">
          <FormField label="Chapter Name">
            <Input
              value={state.editChapter.name}
              onChange={(event) =>
                setState({
                  ...state,
                  editChapter: {
                    ...state.editChapter,
                    name: event.detail.value,
                  },
                })
              }
            />
          </FormField>
          <div>
            <h4>Lecture List</h4>
            <ul>
              {state.editChapter.lectures.map((item, index) => (
                <li
                  key={index}
                  draggable
                  onDragStart={(e) =>
                    onDragLectureStart(e, index)
                  }
                  onDragEnd={onDragLectureEnd}
                  onDragOver={(e) => onDragLectureOver(e, index)}
                >
                  {item.name}
                  <span onClick={() => deleteLecture(index)}><Icon name="close" size="inherit"/></span>
                </li>
              ))}
            </ul>
          </div>
        </SpaceBetween>
        <Button
          variant="primary"
          onClick={() =>
            setState({
              ...state,
              visible: true,
            })
          }
        >
          Add more lecture
        </Button>
      </Container>
    );
  };

  const renderChapters = () => {
    return (
      <div className="lecture-list">
        <SpaceBetween size="xs">
          {state.chapters.map((chapter, cIndex) => {
            return (
              <>
                {state.editChapter.index === cIndex ? (
                  <>
                    {renderEditForm()}
                  </>
                ) : (
                  <ExpandableSection
                    key={cIndex}
                    headerText={chapter.name}
                    variant="container"
                    headerActions={
                      <Button onClick={(e) => editChapter(e, cIndex)}>
                        Edit
                      </Button>
                    }
                  >
                    <ul>
                      {chapter.lectures.map((item, index) => (
                        <li
                          key={index}
                          draggable
                          onDragStart={(e) =>
                            onDragLectureStart(e, cIndex, index)
                          }
                          onDragEnd={onDragLectureEnd}
                          onDragOver={() => onDragLectureOver(cIndex, index)}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </ExpandableSection>
                )}
              </>
            );
          })}
        </SpaceBetween>
      </div>
    );
  };

    return state.redirectToHome ? (
      <Navigate to={"/"} />
    ) : (
      <>
        <NavBar navigation={props.navigation} title="Cloud Academy" />
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
                isLoadingNextStep={state.isLoadingNextStep}
                onSubmit={submitCourse}
                onCancel={backToCourseHome}
                onNavigate={({ detail }) =>
                  setState({
                    ...state,
                    activeStepIndex: detail.requestedStepIndex,
                  })
                }
                activeStepIndex={state.activeStepIndex}
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
                              value={state.name}
                              onChange={(event) =>
                                setState({ ...state, name: event.detail.value })
                              }
                            />
                          </FormField>
                          <FormField label="Course Description">
                            <Textarea
                              value={state.description}
                              rows={4}
                              onChange={(event) =>
                                setState({
                                  ...state,
                                  description: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <FormField
                            label="Category"
                            description="Each category is separated by a comma"
                          >
                            <Input
                              value={state.categories}
                              placeholder="Network, Container"
                              onChange={(event) =>
                                setState({
                                  ...state,
                                  categories: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <FormField label="Level">
                            <Input
                              value={state.level}
                              onChange={(event) =>
                                setState({
                                  ...state,
                                  level: event.detail.value,
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
                            setState({ ...state, publicity: detail.checked })
                          }
                          checked={state.publicity}
                        >
                          Public Course
                        </Toggle>
                        <p>
                          <strong>Course Difficulty</strong>
                        </p>
                        <Toggle
                          onChange={({ detail }) =>
                            setState({ ...state, difficulty: detail.checked })
                          }
                          checked={state.difficulty}
                        >
                          Flexible
                        </Toggle>
                      </Container>
                    ),
                  },
                  {
                    title: "Add Requirements",
                    content: (
                      <Container
                        header={<Header variant="h2">Requirements</Header>}
                      >
                        <SpaceBetween direction="vertical" size="l">
                          <FormField label="Requirement">
                            <Input
                              value={state.currentRequirement}
                              onChange={(event) =>
                                setState({
                                  ...state,
                                  currentRequirement: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <Button
                            variant="primary"
                            onClick={() => {
                              let newReq = state.currentRequirement;
                              setState({
                                ...state,
                                requirements: [...state.requirements, newReq],
                                currentRequirement: "",
                              });

                              // setState({ ...state, currentRequirement: "" });
                            }}
                          >
                            Add requirements
                          </Button>
                          <ColumnLayout columns={2} variant="text-grid">
                            {renderRequirements()}
                          </ColumnLayout>
                        </SpaceBetween>
                      </Container>
                    ),
                    isOptional: false,
                  },
                  {
                    title: "Add Benefits",
                    content: (
                      <Container
                        header={<Header variant="h2">Benefits</Header>}
                      >
                        <SpaceBetween direction="vertical" size="l">
                          <FormField label="Benefit">
                            <Input
                              value={state.currentBenefit}
                              onChange={(event) =>
                                setState({
                                  ...state,
                                  currentBenefit: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <Button
                            variant="primary"
                            onClick={() => {
                              let newBenefit = state.currentBenefit;
                              setState({
                                ...state,
                                whatToLearn: [...state.whatToLearn, newBenefit],
                                currentBenefit: "",
                              });

                              // setState({ ...state, currentRequirement: "" });
                            }}
                          >
                            Add benefit
                          </Button>
                          <ColumnLayout columns={2} variant="text-grid">
                            {renderWhatToLearn()}
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
                                  value={state.currentChapter.name}
                                  onChange={(event) =>
                                    setState({
                                      ...state,
                                      currentChapter: {
                                        name: event.detail.value,
                                        lectures: state.currentChapter.lectures,
                                      },
                                    })
                                  }
                                />
                              </FormField>
                              <Button
                                variant="primary"
                                onClick={() =>{
                                  if (state.currentChapter.name) {
                                    setState({ ...state, visible: true })
                                  }
                                }}
                              >
                                Add
                              </Button>

                              <ColumnLayout columns={1} variant="text-grid">
                                {renderChapters()}
                              </ColumnLayout>

                              <Modal
                                onDismiss={() =>
                                  setState({ ...state, visible: false })
                                }
                                visible={state.visible}
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
                                            state.selectedLectures.length;
                                          setState({
                                            ...state,
                                            selectedLectures: [],
                                            currentChapter: {
                                              name: state.currentChapter.name,
                                              lectures:
                                                state.currentChapter.lectures.slice(
                                                  0,
                                                  state.currentChapter.lectures
                                                    .length -
                                                    selectedLecturesSize
                                                ),
                                            },
                                          });
                                          setState({
                                            ...state,
                                            visible: false,
                                          });
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primary"
                                        onClick={updateLectureForChapter}
                                      >
                                        Ok
                                      </Button>
                                    </SpaceBetween>
                                  </Box>
                                }
                                header="Add Chapter"
                              >
                                <Cards
                                  {...collectionProps}
                                  onSelectionChange={({ detail }) => {
                                    setState({
                                      ...state,
                                      selectedLectures: detail.selectedItems,
                                    });
                                  }}
                                  selectedItems={state.selectedLectures}
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
                                  items={items}
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
                                    <TextFilter
                                      {...filterProps}
                                      filteringPlaceholder="Find lectures"
                                    />
                                  }
                                  header={
                                    <Header
                                      counter={
                                        state.selectedLectures.length
                                          ? "(" +
                                            state.selectedLectures.length +
                                            "/10)"
                                          : "(10)"
                                      }
                                    >
                                      Add lecture
                                    </Header>
                                  }
                                  pagination={
                                    <Pagination {...paginationProps} />
                                  }
                                  preferences={
                                    <CollectionPreferences
                                      title="Preferences"
                                      confirmLabel="Confirm"
                                      cancelLabel="Cancel"
                                      preferences={preferences}
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
                                      onConfirm={({ detail }) =>
                                        setPreferences(detail)
                                      }
                                    />
                                  }
                                />
                              </Modal>
                            </SpaceBetween>
                          </Container>
                          {/* <div style={{ textAlign: "center" }}>
                            <Button
                              variant="primary"
                              onClick={() => setState({ ...state, visible: true })}
                            >
                              Add chapter
                            </Button>
                          </div> */}
                        </SpaceBetween>
                      </>
                    ),
                    isOptional: false,
                  },
                  {
                    title: "Review and launch",
                    content: (
                      <div>
                        <Flashbar items={state.flashItem} />
                        <SpaceBetween size="s">
                          <SpaceBetween size="xs">
                            <Header
                              variant="h3"
                              actions={
                                <Button
                                  onClick={() =>
                                    setState({ ...state, activeStepIndex: 0 })
                                  }
                                >
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
                              <ColumnLayout columns={3} variant="text-grid">
                                <div>
                                  <Box variant="awsui-key-label">
                                    Course Title
                                  </Box>
                                  <div>{state.name}</div>
                                </div>
                                <div>
                                  <Box variant="awsui-key-label">
                                    Course Description
                                  </Box>
                                  <div>{state.description}</div>
                                </div>
                                <div>
                                  <Box variant="awsui-key-label">
                                    Course Publicity
                                  </Box>
                                  <div>{state.publicity ? "yes" : "no"}</div>
                                </div>
                              </ColumnLayout>
                              <ColumnLayout columns={3} variant="text-grid">
                                <div>
                                  <Box variant="awsui-key-label">
                                    Course Difficulty
                                  </Box>
                                  <div>{state.difficulty ? "yes" : "no"}</div>
                                </div>
                                <div>
                                  <Box variant="awsui-key-label">Category</Box>
                                  <div>{state.categories}</div>
                                </div>
                                <div>
                                  <Box variant="awsui-key-label">Level</Box>
                                  <div>{state.level}</div>
                                </div>
                              </ColumnLayout>
                            </Container>
                          </SpaceBetween>
                          <SpaceBetween size="xs">
                            <Header variant="h3">
                              Step 2: Add Requirements
                            </Header>
                            <Container
                              header={<Header variant="h2">Requirement</Header>}
                            >
                              <div>
                                <Box variant="awsui-key-label">
                                  Requirements
                                </Box>
                                <div>
                                  <ol>
                                    {state.requirements.map((item, index) => (
                                      <div className="requirement-item">
                                        <li
                                          className="requirement-item-haft"
                                          key={index}
                                        >
                                          {item}
                                        </li>
                                      </div>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                            </Container>
                          </SpaceBetween>
                          <SpaceBetween size="xs">
                            <Header variant="h3">Step 3: Add Benefits</Header>
                            <Container
                              header={
                                <Header variant="h2">What To Learn</Header>
                              }
                            >
                              <div>
                                <Box variant="awsui-key-label">
                                  What To Learn
                                </Box>
                                <div>
                                  <ol>
                                    {state.whatToLearn.map((item, index) => (
                                      <div className="requirement-item">
                                        <li
                                          className="requirement-item-haft"
                                          key={index}
                                        >
                                          {item}
                                        </li>
                                      </div>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                            </Container>
                          </SpaceBetween>
                          <SpaceBetween size="xs">
                            <Header variant="h3">Step 4: Add Chapter</Header>
                            <Container
                              header={
                                <Header variant="h2">Course Detail</Header>
                              }
                            >
                              <ColumnLayout columns={1} variant="text-grid">
                                <div className="lecture-list">
                                  <SpaceBetween size="xs">
                                    {state.chapters.map((chapter, cIndex) => {
                                      return (
                                        <>
                                          <ExpandableSection
                                            key={cIndex}
                                            headerText={chapter.name}
                                            variant="container"
                                          >
                                            <ul>
                                              {chapter.lectures.map(
                                                (item, index) => (
                                                  <li key={index}>
                                                    {item.name}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </ExpandableSection>
                                        </>
                                      );
                                    })}
                                  </SpaceBetween>
                                </div>
                              </ColumnLayout>
                            </Container>
                          </SpaceBetween>
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
}

export default withAuthenticator(CreateCourse);
