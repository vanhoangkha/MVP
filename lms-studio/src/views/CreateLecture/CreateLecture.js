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

class CreateLecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStepIndex: 0,
            lectureTitle: "",
            lectureDescription: "",
            lectureType: "Video",
            lectureVideo: [],
            workshopUrl: "",
            workshopDescription: "",
            architectureDiagram: [],
            quiz: []
        };
    }

    ReviewAddContent = () => {
        if (this.state.lectureType == "Video") {
            return <ColumnLayout
                columns={2}
                variant="text-grid"
            >
                <div>
                    <Box variant="awsui-key-label">
                        File name
                    </Box>
                    <div>{this.state.lectureVideo.length == 0 ? "" : this.state.lectureVideo[0].name}</div>
                </div>
            </ColumnLayout>
        } else if (this.state.lectureType == "Workshop") {
            return <ColumnLayout
                columns={3}
                variant="text-grid"
            >
                <div>
                    <Box variant="awsui-key-label">
                        Workshop URL
                    </Box>
                    <div>{this.state.workshopUrl}</div>
                </div>
                <div>
                    <Box variant="awsui-key-label">
                        Workshop Description
                    </Box>
                    <div>{this.state.workshopDescription}</div>
                </div>
                <div>
                    <Box variant="awsui-key-label">
                        Architecture Diagram
                    </Box>
                    <div>{this.state.architectureDiagram.length == 0 ? "" : this.state.architectureDiagram[0].name}</div>
                </div>
            </ColumnLayout>
        } else {

            return <ColumnLayout
                columns={3}
                variant="text-grid"
            >
                <div>
                    <Box variant="awsui-key-label">
                        File name
                    </Box>
                    <div>{this.state.quiz.length == 0 ? "" : this.state.quiz[0].name}</div>
                </div>
            </ColumnLayout>
        }
    }

    AddContent = () => {
        if (this.state.lectureType === "Video") {
            return <FormField label="Lecture Videos" description="Theory video for lecture"
            >
                <FileUpload
                    onChange={({ detail }) => this.setState({ lectureVideo: detail.value })}
                    value={this.state.lectureVideo}
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
        } else if (this.state.lectureType == "Workshop") {
            return <div>
                <FormField
                    description="Workshop"
                    label="Hands-on lab for Lecture"
                >
                    <Input
                        value={this.state.workshopUrl}
                        onChange={event =>
                            this.setState({ workshopUrl: event.detail.value })
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
                    <Textarea value={this.state.workshopDescription}
                        onChange={event =>
                            this.setState({ workshopDescription: event.detail.value })
                        } />
                </FormField>
                <FormField
                    label="Workshop Architecture"
                    description="Architecture diagram"
                >
                    <FileUpload
                        onChange={({ detail }) => this.setState({ architectureDiagram: detail.value })}
                        value={this.state.architectureDiagram}
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
            </div>
        } else {
            return <FormField
                label="Quiz"
                description="Add this.state.quiz questions"
            >
                <FileUpload
                    onChange={({ detail }) => this.setState({ quiz: detail.value })}
                    value={this.state.quiz}
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
        }
    }

    render() {
        return (
            <div>
                <NavBar navigation={this.props.navigation} title="Cloud Academy" />
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
                                        header={
                                            <Header variant="h2">
                                                Lecture Detail
                                            </Header>
                                        }
                                    >
                                        <SpaceBetween direction="vertical" size="l">
                                            <FormField label="Lecture Title">
                                                <Input
                                                    value={this.state.lectureTitle}
                                                    onChange={event =>
                                                        this.setState({ lectureTitle: event.detail.value })
                                                    }
                                                />
                                            </FormField>
                                            <FormField label="Lecture Description">
                                                <Input
                                                    value={this.state.lectureDescription}
                                                    onChange={event =>
                                                        this.setState({ lectureDescription: event.detail.value })
                                                    } />
                                            </FormField>
                                            <FormField label="Lecture Type">
                                                <RadioGroup value={this.state.lectureType}
                                                    onChange={event => this.setState({ lectureType: event.detail.value })}
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
                                            {/* <AddContent/> */}
                                            {this.AddContent()}












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
                                                        onClick={() => this.setState({ activeStepIndex: 0 })}
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
                                                        <div>{this.state.lectureTitle}</div>
                                                    </div>
                                                    <div>
                                                        <Box variant="awsui-key-label">
                                                            Description
                                                        </Box>
                                                        <div>{this.state.lectureDescription}</div>
                                                    </div>
                                                    <div>
                                                        <Box variant="awsui-key-label">
                                                            Lecture Type
                                                        </Box>
                                                        <div>{this.state.lectureType}</div>
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
                                                {/* <ReviewAddContent/> */}
                                                {this.ReviewAddContent()}

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
}

export default withAuthenticator(CreateLecture);

