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
import { Storage } from 'aws-amplify';
import { API } from 'aws-amplify';
import {v4 as uuid} from 'uuid'

class CreateLecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
    }

    submitRequest = () => {
        const jsonData = {
            ID: uuid(),
            Name: this.state.lectureTitle,
            Desc: this.state.lectureDescription,
            Type: this.state.lectureType,
            lectureVideoS3Key: this.state.lectureVideoS3Key,
            workshopUrl: this.state.workshopUrl,
            workshopDescription: this.state.workshopDescription,
            architectureDiagramS3Key: this.state.architectureDiagramS3Key,
            quizS3Key: this.state.quizS3Key
        }
        const apiName = 'lmsStudio';
        const path = '/lectures';
        API.put(apiName, path, { body: jsonData })
            .then((response) => {
                console.log(`TODO: handle submission response. ID: ${response.ID}`)
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    getDefaultState = () => {
        return {
            activeStepIndex: 0,
            lectureTitle: "",
            lectureDescription: "",
            lectureType: "Video",
            lectureVideo: [],
            lectureVideoS3Key: "",
            workshopUrl: "",
            workshopDescription: "",
            architectureDiagram: [],
            architectureDiagramS3Key: "",
            randomId: Math.floor(Math.random() * 1000000),
            quiz: [],
            quizS3Key: ""
        }
    }

    uploadLectureVideo = async (file) => {
        if (!(file.type in ['video/mp4', 'video/mov'])) {
            console.log("TODO: lecture video content validation");
        }
        try {
            const s3Key = `lecture-videos/${this.state.randomId}-${file.name.replace(/ /g, "_")}`;
            await Storage.put(s3Key, file, {
                level: "protected",
            });
            this.setState({ lectureVideoS3Key: s3Key })
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    uploadArchitectureDiagram = async (file) => {
        if (!(file.type in ['image/jpeg', 'image/png'])) {
            console.log("TODO: architecture diagram validation");
        }
        try {
            const s3Key = `architecture-diagrams/${this.state.randomId}-${file.name.replace(/ /g, "_")}`;
            await Storage.put(s3Key, file, {
                level: "protected",
            });
            this.setState({ architectureDiagramS3Key: s3Key })
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    uploadQuiz = async (file) => {
        if (!(file.type in ['application/json'])) {
            console.log("TODO: quiz content validation");
        }
        try {
            const s3Key = `quizzes/${this.state.randomId}-${file.name.replace(/ /g, "_")}`;
            await Storage.put(s3Key, file, {
                level: "protected",
            });
            this.setState({ quizS3Key: s3Key })
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    resetQuiz = async () => {
        if (this.state.quizS3Key !== "") {
            await Storage.remove(this.state.quizS3Key, {
                level: "protected"
            });
            this.setState({ quizS3Key: "" });
        }
    }

    resetArchitectureDiagram = async () => {
        if (this.state.architectureDiagramS3Key !== "") {
            await Storage.remove(this.state.architectureDiagramS3Key, {
                level: "protected"
            });
            this.setState({ architectureDiagramS3Key: "" });
        }
    }

    resetLectureVideo = async () => {
        if (this.state.lectureVideoS3Key !== "") {
            await Storage.remove(this.state.lectureVideoS3Key, {
                level: "protected"
            });
            this.setState({ lectureVideoS3Key: "" });
        }
    }


    // render 'Add Content' in step 2
    renderAddContent = () => {
        if (this.state.lectureType === "Video") {
            return <FormField label="Lecture Videos" description="Theory video for lecture"
            >
                <FileUpload
                    onChange={
                        async ({ detail }) => {
                            this.setState({ lectureVideo: detail.value });
                            if (detail.value.length === 0) {
                                this.resetLectureVideo();
                            } else {
                                this.uploadLectureVideo(detail.value[0]);
                            }
                        }
                    }
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
        } else if (this.state.lectureType === "Workshop") {
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
                        onChange={
                            async ({ detail }) => {
                                this.setState({ architectureDiagram: detail.value });
                                if (detail.value.length === 0) {
                                    this.resetArchitectureDiagram();
                                } else {
                                    this.uploadArchitectureDiagram(detail.value[0]);
                                }
                            }
                        }
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
                    onChange={
                        async ({ detail }) => {
                            this.setState({ quiz: detail.value });
                            if (detail.value.length === 0) {
                                this.resetQuiz();
                            } else {
                                this.uploadQuiz(detail.value[0]);
                            }
                        }
                    }
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

    // render review section in step 3
    renderReviewSection = () => {
        if (this.state.lectureType === "Video") {
            return <ColumnLayout
                columns={2}
                variant="text-grid"
            >
                <div>
                    <Box variant="awsui-key-label">
                        File name
                    </Box>
                    <div>{this.state.lectureVideoS3Key}</div>
                </div>
            </ColumnLayout>
        } else if (this.state.lectureType === "Workshop") {
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
                    <div>{this.state.architectureDiagramS3Key}</div>
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
                    <div>{this.state.quizS3Key}</div>
                </div>
            </ColumnLayout>
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
                        onSubmit={this.submitRequest}
                        onCancel={() => {
                            this.resetQuiz();
                            this.resetArchitectureDiagram();
                            this.resetLectureVideo();
                            this.setState(this.getDefaultState());
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
                                            {this.renderAddContent()}












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
                                                {this.renderReviewSection()}

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

export default (CreateLecture);
