import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation} from "react-router-dom";
import './UpdateLecture.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import {
  ColumnLayout,
  BreadcrumbGroup,
  Wizard,
  Container,
  Header,
  SpaceBetween,
  FormField,
  Input,
  Button,
  Box,
  Link,
  Textarea,
  RadioGroup,
  FileUpload,
  Flashbar
} from "@cloudscape-design/components";
import { Storage } from 'aws-amplify';
import { API } from 'aws-amplify';

const successMes = "Update success";
const errorMess = "Error! An error occurred. Please try again later";
function UpdateLecture(props) {

  const [newLecture, setNewLecture] = useState({
    activeStepIndex: 0,
    lectureTitle: "",
    lectureDescription: "",
    lectureType: "Video",
    lectureVideo: [],
    lectureVideoLength: 0,
    lectureVideoS3Key: "",
    workshopUrl: "",
    workshopDescription: "",
    architectureDiagram: [],
    architectureDiagramS3Key: "",
    randomId: Math.floor(Math.random() * 1000000),
    quiz: [],
    quizS3Key: "",
    redirectToHome: false,
    isLoadingNextStep: false,
    flashItem: [],
  });

  const { state } = useLocation();

  useEffect(() => {
    setNewLecture({
      ...newLecture,
      lectureTitle: state.Name,
      lectureDescription: state.Desc,
      lectureType: state.Type,
      workshopUrl: state.WorkshopUrl,
      workshopDescription: state.WorkshopDescription,
      architectureDiagramS3Key: state.ArchitectureDiagramS3Key,
      lectureVideoLength: state.Length,
    })
  }, [])

  const resetFail = () => {
    setNewLecture({ ...newLecture,
      isLoadingNextStep: false,
      flashItem: [
        {
          type: "error",
          content: errorMess,
          dismissible: true,
          dismissLabel: "Dismiss message",
          onDismiss: () => setNewLecture({ ...newLecture, flashItem: [] }),
          id: "error_message",
        },
      ],
    });
  };

  const updateLectureWithNewFile = async () => {
    if (newLecture.lectureType === "Video") {
      uploadLectureVideo(newLecture.lectureVideo[0])
        .then((res) => {
          updateLectureInDB(res.key);
        })
        .catch((error) => {
          resetLectureVideo();
          resetFail();
        });
    } else if (newLecture.lectureType === "Workshop") {
      if (newLecture.architectureDiagram[0]) {
        uploadArchitectureDiagram(newLecture.architectureDiagram[0])
          .then((res) => {
            updateLectureInDB(res.key);
          })
          .catch((error) => {
            resetArchitectureDiagram();
            resetFail();
          });
      } else {
        updateLectureInDB("");
      }
    } else {
      uploadQuiz(newLecture.quiz[0])
        .then((res) => {
          updateLectureInDB(res.key);
        })
        .catch((error) => {
          resetQuiz();
          resetFail();
        });
    }
  }

  const submitRequest = async () => {
    // console.log(detail);
    setNewLecture({ ...newLecture, isLoadingNextStep: true });
    if ( newLecture.lectureVideo[0] || newLecture.architectureDiagram[0] || newLecture.quiz[0]){
      updateLectureWithNewFile();
      removeOldFile(state.Content);
    } else {
      updateLectureInDB(state.Content)
    }
    
  };

  const updateLectureInDB = async (lectureContent) => {
    // console.log(lectureContent)

    const jsonData = {
      ID: state.ID,
      Name: newLecture.lectureTitle ? newLecture.lectureTitle : state.Name,
      Desc: newLecture.lectureDescription,
      Type: newLecture.lectureType,
      Content: lectureContent,
      Length: Math.round(newLecture.lectureVideoLength),
      WorkshopUrl: newLecture.workshopUrl ? newLecture.workshopUrl : state.WorkshopUrl,
      WorkshopDescription: newLecture.workshopDescription,
    };
    const apiName = "lmsStudio";
    const path = "/lectures";
    API.post(apiName, path, { body: jsonData }).then(() => {
      setNewLecture({ ...newLecture, 
        redirectToHome: true,
        // isLoadingNextStep: false,
        // flashItem: [
        //   {
        //     type: "success",
        //     content: successMes,
        //     dismissible: true,
        //     dismissLabel: "Dismiss message",
        //     onDismiss: () => setNewLecture({ ...newLecture, flashItem: [] }),
        //     id: "success_message",
        //   },
        // ],
      });
    })
    .catch( (error) => {
      resetFail()
    })
  };

  const removeOldFile = async (file) => {
    try {
      const res = await Storage.remove(state.Content, {
        level: "public",
      });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const uploadLectureVideo = async (file) => {
    if (!(file.type in ["video/mp4", "video/mov"])) {
      console.log("TODO: lecture video content validation");
    }
    try {
      const s3Key = `lecture-videos/${newLecture.randomId}-${file.name.replace(
        / /g,
        "_"
      )}`;
      const res = await Storage.put(s3Key, file, {
        level: "public",
      });
      return res;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const uploadArchitectureDiagram = async (file) => {
    if (!(file.type in ["image/jpeg", "image/png"])) {
      console.log("TODO: architecture diagram validation");
    }
    try {
      const s3Key = `architecture-diagrams/${
        newLecture.randomId
      }-${file.name.replace(/ /g, "_")}`;
      const res = await Storage.put(s3Key, file, {
        level: "public",
      });
      return res;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const uploadQuiz = async (file) => {
    if (!(file.type in ["application/json"])) {
      console.log("TODO: quiz content validation");
    }
    try {
      const s3Key = `quizzes/${newLecture.randomId}-${file.name.replace(
        / /g,
        "_"
      )}`;
      const res = await Storage.put(s3Key, file, {
        level: "public",
      });
      return res;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const resetQuiz = async () => {
    if (newLecture.quizS3Key !== "") {
      await Storage.remove(newLecture.quizS3Key, {
        level: "protected",
      });
    }
  };

  const resetArchitectureDiagram = async () => {
    if (newLecture.architectureDiagramS3Key !== "") {
      await Storage.remove(newLecture.architectureDiagramS3Key, {
        level: "protected",
      });
    }
  };

  const resetLectureVideo = async () => {
    if (newLecture.lectureVideoS3Key !== "") {
      await Storage.remove(newLecture.lectureVideoS3Key, {
        level: "protected",
      });
    }
  };

  const setLectureLength = (file) =>
    new Promise((resolve, reject) => {
      if (file.length > 0) {
        try {
          let video = document.createElement("video");
          video.preload = "metadata";

          video.onloadedmetadata = function () {
            resolve(this);
          };

          video.onerror = function () {
            reject("Invalid video. Please select a video file.");
          };

          video.src = window.URL.createObjectURL(file[0]);
        } catch (e) {
          reject(e);
        }
      } else {
        setNewLecture({ ...newLecture, lectureVideoLength: 0 });
      }
    });
  
  // render 'Add Content' in step 2
  const renderAddContent = () => {
    if (newLecture.lectureType === "Video") {
      return (
        <FormField
          label="Lecture Videos"
          description="Theory video for lecture"
        >
          <FileUpload
            onChange={async ({ detail }) => {
              // setNewLecture({ ...newLecture, lectureVideo: detail.value });
              const video = await setLectureLength(detail.value);
              setNewLecture({ ...newLecture, lectureVideo: detail.value, lectureVideoLength: video.duration });
            }}
            value={newLecture.lectureVideo}
            i18nStrings={{
              uploadButtonText: (e) => (e ? "Choose files" : "Choose file"),
              dropzoneText: (e) =>
                e ? "Drop files to upload" : "Drop file to upload",
              removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
              limitShowFewer: "Show fewer files",
              limitShowMore: "Show more files",
              errorIconAriaLabel: "Error",
            }}
            showFileLastModified
            showFileSize
            showFileThumbnail
            tokenLimit={3}
            constraintText=".mov, .mp4"
            accept=".mov,.mp4"
          />
        </FormField>
      );
    } else if (newLecture.lectureType === "Workshop") {
      return (
        <div>
          <FormField description="Workshop" label="Hands-on lab for Lecture">
            <Input
              value={newLecture.workshopUrl}
              onChange={(event) =>
                setNewLecture({ ...newLecture, workshopUrl: event.detail.value })
              }
            />
          </FormField>

          <FormField label={<span>Workshop Description</span>}>
            <Textarea
              value={newLecture.workshopDescription}
              onChange={(event) =>
                setNewLecture({ ...newLecture, workshopDescription: event.detail.value })
              }
            />
          </FormField>
          <FormField
            label="Workshop Architecture"
            description="Architecture diagram"
          >
            <FileUpload
              onChange={async ({ detail }) => {
                setNewLecture({ ...newLecture, architectureDiagram: detail.value });
              }}
              value={newLecture.architectureDiagram}
              i18nStrings={{
                uploadButtonText: (e) => (e ? "Choose files" : "Choose file"),
                dropzoneText: (e) =>
                  e ? "Drop files to upload" : "Drop file to upload",
                removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
                limitShowFewer: "Show fewer files",
                limitShowMore: "Show more files",
                errorIconAriaLabel: "Error",
              }}
              showFileLastModified
              showFileSize
              showFileThumbnail
              tokenLimit={3}
              constraintText=".jpeg, .png"
              accept=".jpg,.jpeg,.png"
            />
          </FormField>
        </div>
      );
    } else {
      return (
        <FormField label="Quiz" description="Add questions">
          <FileUpload
            onChange={async ({ detail }) => {
              setNewLecture({ ...newLecture, quiz: detail.value });
            }}
            value={newLecture.quiz}
            i18nStrings={{
              uploadButtonText: (e) => (e ? "Choose files" : "Choose file"),
              dropzoneText: (e) =>
                e ? "Drop files to upload" : "Drop file to upload",
              removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
              limitShowFewer: "Show fewer files",
              limitShowMore: "Show more files",
              errorIconAriaLabel: "Error",
            }}
            showFileLastModified
            showFileSize
            showFileThumbnail
            tokenLimit={3}
            constraintText=".csv"
            accept=".csv"
          />
        </FormField>
      );
    }
  };

  // render review section in step 3
  const renderReviewSection = () => {
    if (newLecture.lectureType === "Video") {
      return (
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">File name</Box>
            <div>
              {newLecture.lectureVideo.length > 0
                ? newLecture.lectureVideo[0].name
                : state.Content}
            </div>
          </div>
        </ColumnLayout>
      );
    } else if (newLecture.lectureType === "Workshop") {
      return (
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Workshop URL</Box>
            <div>{newLecture.workshopUrl}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">Workshop Description</Box>
            <div>{newLecture.workshopDescription}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">Architecture Diagram</Box>
            <div>
              {newLecture.architectureDiagram.length > 0
                ? newLecture.architectureDiagram[0].name
                : state.Content}
            </div>
          </div>
        </ColumnLayout>
      );
    } else {
      return (
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">File name</Box>
            <div>
              {newLecture.quiz.length > 0 ? newLecture.quiz[0].name : state.Content}
            </div>
          </div>
        </ColumnLayout>
      );
    }
  };

    return newLecture.redirectToHome ? (
      <Navigate to={"/"} />
    ) : (
      <div>
        <NavBar navigation={props.navigation} title="Cloud Academy" />
        <div className="create-lecture-main">
          <BreadcrumbGroup
            items={[
              { text: "Home", href: "#" },
              { text: "Lecture", href: "#lectures" },
            ]}
            ariaLabel="Breadcrumbs"
          />
          <Wizard
            i18nStrings={{
              stepNumberLabel: (stepNumber) => `Step ${stepNumber}`,
              collapsedStepsLabel: (stepNumber, stepsCount) =>
                `Step ${stepNumber} of ${stepsCount}`,
              skipToButtonLabel: (step, stepNumber) => `Skip to ${step.title}`,
              navigationAriaLabel: "Steps",
              cancelButton: "Cancel",
              previousButton: "Previous",
              nextButton: "Next",
              submitButton: "Submit",
              optional: "optional",
            }}
            isLoadingNextStep={newLecture.isLoadingNextStep}
            onSubmit={submitRequest}
            onCancel={() => <Navigate to={"/"} />}
            onNavigate={({ detail }) =>
              setNewLecture({ ...newLecture, activeStepIndex: detail.requestedStepIndex })
            }
            activeStepIndex={newLecture.activeStepIndex}
            steps={[
              {
                title: "Add Lecture Detail",
                info: <Link variant="info">Info</Link>,
                description:
                  "Each instance type includes one or more instance sizes, allowing you to scale your resources to the requirements of your target workload.",
                content: (
                  <Container
                    header={<Header variant="h2">Lecture Detail</Header>}
                  >
                    <SpaceBetween direction="vertical" size="l">
                      <FormField label="Lecture Title">
                        <Input
                          value={newLecture.lectureTitle}
                          onChange={(event) =>
                            setNewLecture({ ...newLecture, lectureTitle: event.detail.value })
                          }
                        />
                      </FormField>
                      <FormField label="Lecture Description">
                        <Input
                          value={newLecture.lectureDescription}
                          onChange={(event) =>
                            setNewLecture({
                              ...newLecture, lectureDescription: event.detail.value,
                            })
                          }
                        />
                      </FormField>
                      <FormField label="Lecture Type">
                        <RadioGroup
                          value={newLecture.lectureType}
                          onChange={(event) =>
                            setNewLecture({ ...newLecture, lectureType: event.detail.value })
                          }
                          items={[
                            {
                              value: "Video",
                              label: "Video",
                            },
                            {
                              value: "Workshop",
                              label: "Workshop",
                            },
                            { value: "Quiz", label: "Quiz" },
                          ]}
                        />
                      </FormField>
                    </SpaceBetween>
                  </Container>
                ),
              },
              {
                title: "Add Content",
                content: (
                  <Container
                    header={<Header variant="h2">Lecture Content</Header>}
                  >
                    <SpaceBetween direction="vertical" size="l">
                      {renderAddContent()}
                    </SpaceBetween>
                  </Container>
                ),
                isOptional: false,
              },
              {
                title: "Review and launch",
                content: (
                  <div>
                    <SpaceBetween direction="vertical" size="l">
                      <SpaceBetween direction="vertical" size="s">
                        <Flashbar items={newLecture.flashItem} />
                        <Header
                          variant="h3"
                          actions={
                            <Button
                              onClick={() =>
                                setNewLecture({ ...newLecture, activeStepIndex: 0 })
                              }
                            >
                              Edit
                            </Button>
                          }
                        >
                          Step 1: Add Lecture Detail
                        </Header>
                        <Container
                          header={<Header variant="h2">Lecture Detail</Header>}
                        >
                          <ColumnLayout columns={3} variant="text-grid">
                            <div>
                              <Box variant="awsui-key-label">Lecture title</Box>
                              <div>{newLecture.lectureTitle}</div>
                            </div>
                            <div>
                              <Box variant="awsui-key-label">Description</Box>
                              <div>{newLecture.lectureDescription}</div>
                            </div>
                            <div>
                              <Box variant="awsui-key-label">Lecture Type</Box>
                              <div>{newLecture.lectureType}</div>
                            </div>
                          </ColumnLayout>
                        </Container>
                      </SpaceBetween>
                      <SpaceBetween size="xs">
                        <Header variant="h3">Step 2: Add Content</Header>
                        <Container
                          header={<Header variant="h2">Lecture Content</Header>}
                        >
                          {renderReviewSection()}
                        </Container>
                      </SpaceBetween>
                    </SpaceBetween>
                  </div>
                ),
              },
            ]}
          />
        </div>
        <Footer />
      </div>
    );
}

export default (UpdateLecture);
