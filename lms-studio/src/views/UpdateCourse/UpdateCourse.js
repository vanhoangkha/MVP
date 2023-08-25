import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import { API } from "aws-amplify";
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

function UpdateCourse(props) {
  const [newCourse, setNewCourse] = useState({
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
    chapters: [],
    visible: false,
    editChapter: {
      index: -1,
      name: "",
      lectures: [],
    },
  })
  const [existingLectures, setExistingLectures] = useState([]);
  const [selectedLectures, setSelectedLectures] = useState([]);
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false);
  const [flashItem, setFlashItem] = useState([]);

  const { state } = useLocation();

  const draggedItem = useRef(null)
  let draggedIdx;

  const [preferences, setPreferences] = useState({ pageSize: 6, visibleContent: ["description", "type", "size"] });
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    existingLectures,
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
        setExistingLectures(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [])

  let str_categories = "";
  state.Categories.map((cate, index) => {
    str_categories += (index !== 0 ? ', ' : ' ') + cate
  })
  
  useEffect(() => {
    setNewCourse({
      ...newCourse,
      name: state.Name,
      description: state.Description,
      level: state.Level,
      categories: str_categories,
      requirements: state.Requirements,
      difficulty: state.Difficulty,
      whatToLearn: state.WhatToLearn,
      chapters: state.Chapters,
    })
  }, [])

  const deleteRequirement = (index) => {
    let list = [...newCourse.requirements]
    list.splice(index, 1);
    setNewCourse({...newCourse, requirements: list})
  }

  const deleteBenefit = (index) => {
    let list = [...newCourse.whatToLearn]
    list.splice(index, 1);
    setNewCourse({...newCourse, whatToLearn: list})
  }

  const renderRequirements = () => {
    return <>
        {newCourse.requirements.map((item, index) => (
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
    return <>
        {newCourse.whatToLearn.map((item, index) => (
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
    draggedItem.current = newCourse.editChapter.lectures[index];
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragLectureOver = (e, index) => {
    const draggedOverItem = newCourse.editChapter.lectures[index];

    // if the item is dragged over itself, ignore
    if (draggedItem.current === draggedOverItem || !draggedItem.current) {
      return;
    }

    // filter out the currently dragged item
    let items = newCourse.editChapter.lectures.filter(item => item !== draggedItem.current);

    // add the dragged item after the dragged over item
    items.splice(index, 0, draggedItem.current);

    // set updated items for chapters
    let chapterList = newCourse.editChapter;
    chapterList.lectures = items;
    setNewCourse({ ...newCourse, editChapter: chapterList})
  };

  const onDragLectureEnd = () => {
    draggedIdx = null;
  };
  
  const editChapter = (e, cIndex) => {
    let chapter = newCourse.chapters[cIndex];
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
    setNewCourse({ ...newCourse, 
        editChapter: chapter,
    });
    setSelectedLectures(selectedLectures)
  }

  const saveEditChapter = () => {
    const existChapters = newCourse.chapters;
    existChapters[newCourse.editChapter.index] = newCourse.editChapter
    setNewCourse({
        ...newCourse,
        chapters: existChapters,
        editChapter: {
            index: -1,
            name: "",
            lectures: [],
        },
    })
    setSelectedLectures([])
  }

  const deleteChapter = () => {
    let newChapter = [...newCourse.chapters];
    newChapter.splice(newCourse.editChapter.index);
    setNewCourse({...newCourse, chapters: newChapter, editChapter: {
      index: -1,
      name: "",
      lectures: [],
    }});
    setSelectedLectures([])
  }

  const deleteLecture = (index) => {
    let newEditChapter = newCourse.editChapter
    let selectedLec = [...selectedLectures]
    newEditChapter.lectures.splice(index, 1);
    setNewCourse({...newCourse, 
        editChapter: newEditChapter,
    })
    setSelectedLectures(selectedLec.splice(index, 1))
  }

  const updateLectureForChapter = () => {
    const newlySelectedLectures = selectedLectures.map((lecture) => {
      return {
        name: lecture.Name,
        lectureId: lecture.ID,
        type: lecture.Type,
        length: lecture.Length,
      };
    });
    

    if (newCourse.editChapter.index === -1) {
      const updatedCurrChapter = {
        name: newCourse.currentChapter.name,
        lectures: newCourse.currentChapter.lectures.concat(newlySelectedLectures),
      };

      setNewCourse({
        ...newCourse,
        currentChapter: {
          name: "",
          lectures: [],
        },
        chapters: [...newCourse.chapters, updatedCurrChapter],
        visible: false,
      });
      setSelectedLectures([])
    }else {
        setNewCourse({
            ...newCourse,
            editChapter: {...newCourse.editChapter, lectures: newlySelectedLectures},
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
    setIsLoadingNextStep(true)

    let courseLength = 0;
    let categories = newCourse.categories.split(",")
    newCourse.chapters.map((chapter) => {
        chapter.lectures.map((lecture)=> {
            courseLength += lecture.length
        })
    })

    const jsonData = {
        ID: newCourse.name.trim() ? convertNameToID(newCourse.name) : state.ID,
        Name: newCourse.name.trim() ? newCourse.name.trim() : state.name,
        Description: newCourse.description,
        Length: courseLength,
        Level: newCourse.level,
        Categories: categories,
        Requirements: newCourse.requirements,
        Difficulty: newCourse.difficulty,
        WhatToLearn: newCourse.whatToLearn,
        Chapters: newCourse.chapters,
    }

    const apiName = "lmsStudio";
    const path = "/courses";
    try {
      await API.post(apiName, path, { body: jsonData });
      setIsLoadingNextStep(false)
      setNewCourse({
        ...newCourse,
        redirectToHome: true,
      });
      setFlashItem( [
        {
          type: "success",
          content: successMes,
          dismissible: true,
          dismissLabel: "Dismiss message",
          onDismiss: () => setFlashItem([]),
          id: "success_message",
        },
      ])
    } catch (error) {
      setIsLoadingNextStep(false)
      setNewCourse({
        ...newCourse,
      });
      setFlashItem(
        [
          {
            type: "error",
            content: errorMess,
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setFlashItem([]),
            id: "error_message",
          },
        ]
      )
    }
  }

  const renderEditForm = () => {
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
            {newCourse.editChapter.name}
          </Header>
        }
      >
        <SpaceBetween size="s">
          <FormField label="Chapter Name">
            <Input
              value={newCourse.editChapter.name}
              onChange={(event) =>
                setNewCourse({
                  ...newCourse,
                  editChapter: {
                    ...newCourse.editChapter,
                    name: event.detail.value,
                  },
                })
              }
            />
          </FormField>
          <div>
            <h4>Lecture List</h4>
            <ul>
              {newCourse.editChapter.lectures.map((item, index) => (
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
            setNewCourse({
              ...newCourse,
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
          {newCourse.chapters.map((chapter, cIndex) => {
            return (
              <>
                {newCourse.editChapter.index === cIndex ? (
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

    return newCourse.redirectToHome ? (
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
                  submitButton: "Update course",
                  optional: "optional",
                }}
                isLoadingNextStep={isLoadingNextStep}
                onSubmit={submitCourse}
                onNavigate={({ detail }) =>
                  setNewCourse({
                    ...newCourse,
                    activeStepIndex: detail.requestedStepIndex,
                  })
                }
                activeStepIndex={newCourse.activeStepIndex}
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
                              value={newCourse.name}
                              onChange={(event) =>
                                setNewCourse({
                                  ...newCourse,
                                  name: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <FormField label="Course Description">
                            <Textarea
                              value={newCourse.description}
                              rows={4}
                              onChange={(event) =>
                                setNewCourse({
                                  ...newCourse,
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
                              value={newCourse.categories}
                              placeholder="Network, Container"
                              onChange={(event) =>
                                setNewCourse({
                                  ...newCourse,
                                  categories: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <FormField label="Level">
                            <Input
                              value={newCourse.level}
                              onChange={(event) =>
                                setNewCourse({
                                  ...newCourse,
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
                            setNewCourse({
                              ...newCourse,
                              publicity: detail.checked,
                            })
                          }
                          checked={newCourse.publicity}
                        >
                          Public Course
                        </Toggle>
                        <p>
                          <strong>Course Difficulty</strong>
                        </p>
                        <Toggle
                          onChange={({ detail }) =>
                            setNewCourse({
                              ...newCourse,
                              difficulty: detail.checked,
                            })
                          }
                          checked={newCourse.difficulty}
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
                              value={newCourse.currentRequirement}
                              onChange={(event) =>
                                setNewCourse({
                                  ...newCourse,
                                  currentRequirement: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <Button
                            variant="primary"
                            onClick={() => {
                              let newReq = newCourse.currentRequirement;
                              setNewCourse({
                                ...newCourse,
                                requirements: [
                                  ...newCourse.requirements,
                                  newReq,
                                ],
                                currentRequirement: "",
                              });

                              // setNewCourse({ ...newCourse, currentRequirement: "" });
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
                              value={newCourse.currentBenefit}
                              onChange={(event) =>
                                setNewCourse({
                                  ...newCourse,
                                  currentBenefit: event.detail.value,
                                })
                              }
                            />
                          </FormField>
                          <Button
                            variant="primary"
                            onClick={() => {
                              let newBenefit = newCourse.currentBenefit;
                              setNewCourse({
                                ...newCourse,
                                whatToLearn: [
                                  ...newCourse.whatToLearn,
                                  newBenefit,
                                ],
                                currentBenefit: "",
                              });

                              // setNewCourse({ ...newCourse, currentRequirement: "" });
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
                                  value={newCourse.currentChapter.name}
                                  onChange={(event) =>
                                    setNewCourse({
                                      ...newCourse,
                                      currentChapter: {
                                        name: event.detail.value,
                                        lectures:
                                          newCourse.currentChapter.lectures,
                                      },
                                    })
                                  }
                                />
                              </FormField>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  newCourse.currentChapter.name ? (
                                    setNewCourse({
                                      ...newCourse,
                                      visible: true,
                                    })
                                  ) : (
                                    <></>
                                  );
                                }}
                              >
                                Add
                              </Button>

                              <ColumnLayout columns={1} variant="text-grid">
                                {renderChapters()}
                              </ColumnLayout>

                              <Modal
                                onDismiss={() =>
                                  setNewCourse({ ...newCourse, visible: false })
                                }
                                visible={newCourse.visible}
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
                                            selectedLectures.length;
                                          setNewCourse({
                                            ...newCourse,
                                            currentChapter: {
                                              name: newCourse.currentChapter
                                                .name,
                                              lectures:
                                                newCourse.currentChapter.lectures.slice(
                                                  0,
                                                  newCourse.currentChapter
                                                    .lectures.length -
                                                    selectedLecturesSize
                                                ),
                                            },
                                          });
                                          setNewCourse({
                                            ...newCourse,
                                            visible: false,
                                          });
                                          setSelectedLectures([]);
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
                                    setSelectedLectures(detail.selectedItems);
                                  }}
                                  selectedItems={selectedLectures}
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
                                        selectedLectures.length
                                          ? "(" +
                                            selectedLectures.length +
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
                              onClick={() => setNewCourse({ ...newCourse, visible: true })}
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
                        <Flashbar items={flashItem} />
                        <SpaceBetween size="s">
                          <SpaceBetween size="xs">
                            <Header
                              variant="h3"
                              actions={
                                <Button
                                  onClick={() =>
                                    setNewCourse({
                                      ...newCourse,
                                      activeStepIndex: 0,
                                    })
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
                                  <div>{newCourse.name}</div>
                                </div>
                                <div>
                                  <Box variant="awsui-key-label">
                                    Course Description
                                  </Box>
                                  <div>{newCourse.description}</div>
                                </div>
                                <div>
                                  <Box variant="awsui-key-label">
                                    Course Publicity
                                  </Box>
                                  <div>
                                    {newCourse.publicity ? "yes" : "no"}
                                  </div>
                                </div>
                              </ColumnLayout>
                              <ColumnLayout columns={3} variant="text-grid">
                                <div>
                                  <Box variant="awsui-key-label">
                                    Course Difficulty
                                  </Box>
                                  <div>
                                    {newCourse.difficulty ? "yes" : "no"}
                                  </div>
                                </div>
                                <div>
                                  <Box variant="awsui-key-label">Category</Box>
                                  <div>{newCourse.categories}</div>
                                </div>
                                <div>
                                  <Box variant="awsui-key-label">Level</Box>
                                  <div>{newCourse.level}</div>
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
                                    {newCourse.requirements.map(
                                      (item, index) => (
                                        <div className="requirement-item">
                                          <li
                                            className="requirement-item-haft"
                                            key={index}
                                          >
                                            {item}
                                          </li>
                                        </div>
                                      )
                                    )}
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
                                    {newCourse.whatToLearn.map(
                                      (item, index) => (
                                        <div className="requirement-item">
                                          <li
                                            className="requirement-item-haft"
                                            key={index}
                                          >
                                            {item}
                                          </li>
                                        </div>
                                      )
                                    )}
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
                                <SpaceBetween size="xs">
                                  {newCourse.chapters.map((chapter, cIndex) => {
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
                                                <li key={index}>{item.name}</li>
                                              )
                                            )}
                                          </ul>
                                        </ExpandableSection>
                                      </>
                                    );
                                  })}
                                </SpaceBetween>
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

export default withAuthenticator(UpdateCourse);
