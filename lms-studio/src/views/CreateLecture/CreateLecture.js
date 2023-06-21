import React from 'react';
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
import Box from "@cloudscape-design/components/box";
import Link from "@cloudscape-design/components/link";
import Textarea from "@cloudscape-design/components/textarea";
import RadioGroup from "@cloudscape-design/components/radio-group";
import FileUpload from "@cloudscape-design/components/file-upload";
import { withAuthenticator } from '@aws-amplify/ui-react';

const CreateLecture = (props) => {
  const [
    activeStepIndex,
    setActiveStepIndex
  ] = React.useState(1);

  const [lectureContent, setLectureContent] = React.useState([]);
  const [workshopUrl, setWorkshopUrl] = React.useState("");
  const [architectureDiagram, setArchitectureDiagram] = React.useState([]);
  const [quiz, setQuiz] = React.useState([]);

  return (
    <div>
            <NavBar navigation={props.navigation} title="Cloud Academy"/>
            <div className='create-lecture-main'>
                
    <BreadcrumbGroup
      items={[
        { text: "Home", href: "#" },
        { text: "Lecture", href: "#lectures" }
      ]}
      ariaLabel="Breadcrumbs"
    />

<Wizard
      i18nStrings={{
        stepNumberLabel: stepNumber =>
          `Step ${stepNumber}`,
        collapsedStepsLabel: (stepNumber, stepsCount) =>
          `Step ${stepNumber} of ${stepsCount}`,
        skipToButtonLabel: (step, stepNumber) =>
          `Skip to ${step.title}`,
        navigationAriaLabel: "Steps",
        cancelButton: "Cancel",
        previousButton: "Previous",
        nextButton: "Next",
        submitButton: "Submit",
        optional: "optional"
      }}
      onNavigate={({ detail }) =>
        setActiveStepIndex(detail.requestedStepIndex)
      }
      activeStepIndex={activeStepIndex}
      steps={[
        {
          title: "Add Lecture Detail",
          info: <Link variant="info">Info</Link>,
          description:
            "Each instance type includes one or more instance sizes, allowing you to scale your resources to the requirements of your target workload.",
          content: (
            <Container
              header={
                <Header variant="h2">
                  Lecture Detail
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="l">
                <FormField label="Lecture Title">
                  <Input />
                </FormField>
                <FormField label="Lecture Description">
                  <Input />
                </FormField>
                <FormField label="Lecture Type">
                <RadioGroup
                    items={[
                    {
                        value: "Video",
                        label: "Video"
                    },
                    {
                        value: "Workshop",
                        label: "Workshop"
                    },
                    { value: "Quiz", label: "Quiz" }
                    ]}
                />
                </FormField>
              </SpaceBetween>
            </Container>
          )
        },
        {
          title: "Add Content",
          content: (
            <Container
              header={
                <Header variant="h2">
                  Lecture Content
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="l">
              <FormField
                label="Lecture Videos"
                description="Theory video for lecture"
                >
                <FileUpload
                    onChange={({ detail }) => setLectureContent(detail.value)}
                    value={lectureContent}
                    i18nStrings={{
                    uploadButtonText: e =>
                        e ? "Choose files" : "Choose file",
                    dropzoneText: e =>
                        e
                        ? "Drop files to upload"
                        : "Drop file to upload",
                    removeFileAriaLabel: e =>
                        `Remove file ${e + 1}`,
                    limitShowFewer: "Show fewer files",
                    limitShowMore: "Show more files",
                    errorIconAriaLabel: "Error"
                    }}
                    showFileLastModified
                    showFileSize
                    showFileThumbnail
                    tokenLimit={3}
                    constraintText=".mov, .mp4"
                />
                </FormField>

                <FormField
                description="Workshop"
                label="Hands-on lab for Lecture"
                >
                <Input
                    value={workshopUrl}
                    onChange={event =>
                    setWorkshopUrl(event.detail.value)
                    }
                />
                </FormField>

                <FormField
                label={
                    <span>
                    Workshop Description
                    </span>
                }
                >
                <Textarea />
                </FormField>
                <FormField
                label="Workshop Architecture"
                description="Architecture diagram"
                >
                <FileUpload
                    onChange={({ detail }) => setArchitectureDiagram(detail.value)}
                    value={architectureDiagram}
                    i18nStrings={{
                    uploadButtonText: e =>
                        e ? "Choose files" : "Choose file",
                    dropzoneText: e =>
                        e
                        ? "Drop files to upload"
                        : "Drop file to upload",
                    removeFileAriaLabel: e =>
                        `Remove file ${e + 1}`,
                    limitShowFewer: "Show fewer files",
                    limitShowMore: "Show more files",
                    errorIconAriaLabel: "Error"
                    }}
                    showFileLastModified
                    showFileSize
                    showFileThumbnail
                    tokenLimit={3}
                    constraintText=".jpeg, .png"
                />
                </FormField>
                <FormField
                label="Quiz"
                description="Add quiz questions"
                >
                <FileUpload
                    onChange={({ detail }) => setQuiz(detail.value)}
                    value={quiz}
                    i18nStrings={{
                    uploadButtonText: e =>
                        e ? "Choose files" : "Choose file",
                    dropzoneText: e =>
                        e
                        ? "Drop files to upload"
                        : "Drop file to upload",
                    removeFileAriaLabel: e =>
                        `Remove file ${e + 1}`,
                    limitShowFewer: "Show fewer files",
                    limitShowMore: "Show more files",
                    errorIconAriaLabel: "Error"
                    }}
                    showFileLastModified
                    showFileSize
                    showFileThumbnail
                    tokenLimit={3}
                    constraintText=".json"
                />
                </FormField>
              </SpaceBetween>
            </Container>
          ),
          isOptional: false
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
                    onClick={() => setActiveStepIndex(0)}
                  >
                    Edit
                  </Button>
                }
              >
                Step 1: Add Lecture Detail
              </Header>
              <Container
                header={
                  <Header variant="h2">
                    Lecture Detail
                  </Header>
                }
              >
                <ColumnLayout
                  columns={3}
                  variant="text-grid"
                >
                  <div>
                    <Box variant="awsui-key-label">
                      Lecture title
                    </Box>
                    <div>Value</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">
                      Description
                    </Box>
                    <div>Value</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">
                      Lecture Type
                    </Box>
                    <div>Value</div>
                  </div>
                </ColumnLayout>
              </Container>
            </SpaceBetween>
            <SpaceBetween size="xs">
            <Header
              variant="h3"
            >
              Step 2: Add Content
            </Header>
            <Container
              header={
                <Header variant="h2">
                  Lecture Content
                </Header>
              }
            >
              <ColumnLayout
                columns={3}
                variant="text-grid"
              >
                <div>
                  <Box variant="awsui-key-label">
                    File name
                  </Box>
                  <div>Value</div>
                </div>
                <div>
                  <Box variant="awsui-key-label">
                    Description
                  </Box>
                  <div>Value</div>
                </div>
              </ColumnLayout>
            </Container>
          </SpaceBetween>
          </div>
          )
        }
      ]}
    />
            </div>
            <Footer />
        </div>
  );
}

export default withAuthenticator(CreateLecture);

