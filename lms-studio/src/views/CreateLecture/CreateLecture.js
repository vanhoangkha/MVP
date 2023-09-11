import React from 'react';
import { Navigate } from "react-router-dom";
import './CreateLecture.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import ColumnLayout from "@cloudscape-design/components/column-layout";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Wizard from "@cloudscape-design/components/wizard";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import Alert from "@cloudscape-design/components/alert"
import Box from "@cloudscape-design/components/box";
import Link from "@cloudscape-design/components/link";
import Textarea from "@cloudscape-design/components/textarea";
import RadioGroup from "@cloudscape-design/components/radio-group";
import FileUpload from "@cloudscape-design/components/file-upload";
import Flashbar from "@cloudscape-design/components/flashbar";
import StatusIndicator from "@cloudscape-design/components/status-indicator"
import { Storage } from 'aws-amplify';
import { API } from 'aws-amplify';
import {v4 as uuid} from 'uuid'

const successMes = "Created success";
const errorMess = "Error! An error occurred. Please try again later";
class CreateLecture extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  submitRequest = async () => {
    // console.log(detail);
    this.setState({ isLoadingNextStep: true });

    if (this.state.lectureType === "Video") {
      this.uploadLectureVideo(this.state.lectureVideo[0])
        .then((res) => {
          this.writeLectureToDB(res.key);
        })
        .catch((error) => {
          this.resetLectureVideo();
          this.setState({
            isLoadingNextStep: false,
            flashItem: [
              {
                type: "error",
                content: errorMess,
                dismissible: true,
                dismissLabel: "Dismiss message",
                onDismiss: () => this.setState({ flashItem: [] }),
                id: "error_message",
              },
            ],
          });
        });
    } else if (this.state.lectureType === "Workshop") {
      if (this.state.architectureDiagram[0]) {
        this.uploadArchitectureDiagram(this.state.architectureDiagram[0])
          .then((res) => {
            this.writeLectureToDB(res.key);
          })
          .catch((error) => {
            this.resetArchitectureDiagram();
            this.setState({
              isLoadingNextStep: false,
              flashItem: [
                {
                  type: "error",
                  content: errorMess,
                  dismissible: true,
                  dismissLabel: "Dismiss message",
                  onDismiss: () => this.setState({ flashItem: [] }),
                  id: "error_message",
                },
              ],
            });
          });
      } else {
        this.writeLectureToDB("");
      }
    } else {
      this.uploadQuiz(this.state.quiz[0])
        .then((res) => {
          this.writeLectureToDB(res.key);
        })
        .catch((error) => {
          this.resetQuiz();
          this.setState({
            isLoadingNextStep: false,
            flashItem: [
              {
                type: "error",
                content: errorMess,
                dismissible: true,
                dismissLabel: "Dismiss message",
                onDismiss: () => this.setState({ flashItem: [] }),
                id: "error_message",
              },
            ],
          });
        });
    }
  };
  
  writeLectureToDB = async (lectureContent) => {
    // console.log(lectureContent)

    const jsonData = {
      ID: uuid(),
      Name: this.state.lectureTitle,
      Desc: this.state.lectureDescription,
      Type: this.state.lectureType,
      Content: lectureContent,
      Length: Math.round(this.state.lectureVideoLength),
      WorkshopUrl: this.state.workshopUrl,
      WorkshopDescription: this.state.workshopDescription,
      ArchitectureDiagramS3Key: this.state.architectureDiagramS3Key,
      QuizS3Key: this.state.quizS3Key,
      LastUpdated: new Date().toISOString(),
      Views: 0,
    };
    const apiName = "lmsStudio";
    const path = "/lectures";
    try {
      await API.put(apiName, path, { body: jsonData });
      this.setState({
        redirectToHome: true,
        isLoadingNextStep: false,
        flashItem: [
          {
            type: "success",
            content: successMes,
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => this.setState({ flashItem: [] }),
            id: "success_message",
          },
        ],
      });
    } catch (error) {
      this.setState({
        isLoadingNextStep: false,
        flashItem: [
          {
            type: "error",
            content: errorMess,
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => this.setState({ flashItem: [] }),
            id: "error_message",
          },
        ],
      });
    }
  };
  getDefaultState = () => {
    return {
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
    };
  };

  uploadLectureVideo = async (file) => {
    if (!(file.type in ["video/mp4", "video/mov"])) {
      console.log("TODO: lecture video content validation");
    }
    try {
      const s3Key = `lecture-videos/${this.state.randomId}-${file.name.replace(
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

  uploadArchitectureDiagram = async (file) => {
    if (!(file.type in ["image/jpeg", "image/png"])) {
      console.log("TODO: architecture diagram validation");
    }
    try {
      const s3Key = `architecture-diagrams/${
        this.state.randomId
      }-${file.name.replace(/ /g, "_")}`;
      const res = await Storage.put(s3Key, file, {
        level: "public",
      });
      return res;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  uploadQuiz = async (file) => {
    if (!(file.type in ["application/json"])) {
      console.log("TODO: quiz content validation");
    }
    try {
      const s3Key = `quizzes/${this.state.randomId}-${file.name.replace(
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

  resetQuiz = async () => {
    if (this.state.quizS3Key !== "") {
      await Storage.remove(this.state.quizS3Key, {
        level: "protected",
      });
    }
  };

  resetArchitectureDiagram = async () => {
    if (this.state.architectureDiagramS3Key !== "") {
      await Storage.remove(this.state.architectureDiagramS3Key, {
        level: "protected",
      });
    }
  };

  resetLectureVideo = async () => {
    if (this.state.lectureVideoS3Key !== "") {
      await Storage.remove(this.state.lectureVideoS3Key, {
        level: "protected",
      });
    }
  };

  setLectureLength = (file) =>
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
        this.setState({ lectureVideoLength: 0 });
      }
    });

  // render 'Add Content' in step 2
  renderAddContent = () => {
    if (this.state.lectureType === "Video") {
      return (
        <FormField
          label="Lecture Videos"
          description="Theory video for lecture"
        >
          <FileUpload
            onChange={async ({ detail }) => {
              this.setState({ lectureVideo: detail.value });
              const video = await this.setLectureLength(detail.value);
              this.setState({ lectureVideoLength: video.duration });
              //  console.log(detail.value[0])
              //   if (detail.value.length === 0) {
              //     this.resetLectureVideo();
              //   } else {
              //     this.uploadLectureVideo(detail.value[0]);
              //   }
            }}
            value={this.state.lectureVideo}
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
    } else if (this.state.lectureType === "Workshop") {
      return (
        <SpaceBetween direction="vertical" size="s">
          <FormField label="Workshop" description="Hands-on lab for Lecture">
            <Input
              value={this.state.workshopUrl}
              onChange={(event) =>
                this.setState({ workshopUrl: event.detail.value })
              }
            />
          </FormField>

          <FormField label={<span>Workshop Description</span>}>
            <Textarea
              value={this.state.workshopDescription}
              onChange={(event) =>
                this.setState({ workshopDescription: event.detail.value })
              }
            />
          </FormField>
          <FormField
            label="Workshop Architecture"
            description="Architecture diagram"
          >
            <FileUpload
              onChange={async ({ detail }) => {
                this.setState({ architectureDiagram: detail.value });
                // if (detail.value.length === 0) {
                //   this.resetArchitectureDiagram();
                // } else {
                //   this.uploadArchitectureDiagram(detail.value[0]);
                // }
              }}
              value={this.state.architectureDiagram}
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
        </SpaceBetween>
      );
    } else {
      return (
        <FormField label="Quiz" description="Add quiz file">
          <FileUpload
            onChange={async ({ detail }) => {
              this.setState({ quiz: detail.value });
              //   if (detail.value.length === 0) {
              //     this.resetQuiz();
              //   } else {
              //     this.uploadQuiz(detail.value[0]);
              //   }
            }}
            value={this.state.quiz}
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
  renderReviewSection = () => {
    if (this.state.lectureType === "Video") {
      return (
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">File name</Box>
            <div>
              {this.state.lectureVideo.length > 0
                ? this.state.lectureVideo[0].name
                : ""}
            </div>
          </div>
        </ColumnLayout>
      );
    } else if (this.state.lectureType === "Workshop") {
      return (
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Workshop URL</Box>
            <div>{this.state.workshopUrl}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">Workshop Description</Box>
            <div>{this.state.workshopDescription}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">Architecture Diagram</Box>
            <div>
              {this.state.architectureDiagram.length > 0
                ? this.state.architectureDiagram[0].name
                : ""}
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
              {this.state.quiz.length > 0 ? this.state.quiz[0].name : ""}
            </div>
          </div>
        </ColumnLayout>
      );
    }
  };

  render() {
    return this.state.redirectToHome ? (
      <Navigate to={"/"} />
    ) : (
      <div>
        <NavBar navigation={this.props.navigation} title="Cloud Academy" />
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
            isLoadingNextStep={this.state.isLoadingNextStep}
            onSubmit={this.submitRequest}
            onCancel={() => this.setState({redirectToHome: true})}
            onNavigate={({ detail }) =>
              this.setState({ activeStepIndex: detail.requestedStepIndex })
            }
            activeStepIndex={this.state.activeStepIndex}
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
                          value={this.state.lectureTitle}
                          onChange={(event) =>
                            this.setState({ lectureTitle: event.detail.value })
                          }
                        />
                      </FormField>
                      <FormField label="Lecture Description">
                        <Input
                          value={this.state.lectureDescription}
                          onChange={(event) =>
                            this.setState({
                              lectureDescription: event.detail.value,
                            })
                          }
                        />
                      </FormField>
                      <FormField label="Lecture Type">
                        <RadioGroup
                          value={this.state.lectureType}
                          onChange={(event) =>
                            this.setState({ lectureType: event.detail.value })
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
                      {this.renderAddContent()}
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
                        <Flashbar items={this.state.flashItem} />
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
                          Step 1: Add Lecture Detail
                        </Header>
                        <Container
                          header={<Header variant="h2">Lecture Detail</Header>}
                        >
                          <ColumnLayout columns={3} variant="text-grid">
                            <div>
                              <Box variant="awsui-key-label">Lecture title</Box>
                              <div>{this.state.lectureTitle}</div>
                            </div>
                            <div>
                              <Box variant="awsui-key-label">Description</Box>
                              <div>{this.state.lectureDescription}</div>
                            </div>
                            <div>
                              <Box variant="awsui-key-label">Lecture Type</Box>
                              <div>{this.state.lectureType}</div>
                            </div>
                          </ColumnLayout>
                        </Container>
                      </SpaceBetween>
                      <SpaceBetween size="xs">
                        <Header variant="h3">Step 2: Add Content</Header>
                        <Container
                          header={<Header variant="h2">Lecture Content</Header>}
                        >
                          {this.renderReviewSection()}
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
}

export default (CreateLecture);
