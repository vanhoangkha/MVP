import React from 'react';
import ColumnLayout from "@cloudscape-design/components/column-layout";
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
import { putContentService } from "../services/content";
import { v4 as uuid } from 'uuid'

class CreateContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
    }

    submitRequest = () => {
        const jsonData = {
            ID: uuid(),
            Name: this.state.contentTitle,
            Desc: this.state.contentDescription,
            Type: this.state.contentType,
            // TODO: change to contentVideoS3Key
            lectureVideoS3Key: this.state.contentVideoS3Key,
            workshopUrl: this.state.workshopUrl,
            workshopDescription: this.state.workshopDescription,
            architectureDiagramS3Key: this.state.architectureDiagramS3Key,
            quizS3Key: this.state.quizS3Key
        }
        putContentService(jsonData)
            .then((response) => {
                console.log(`TODO: handle submission response. ID: ${response.ID}`);
                this.setState(this.getDefaultState());
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    getDefaultState = () => {
        return {
            activeStepIndex: 0,
            contentTitle: "",
            contentDescription: "",
            contentType: "Video",
            contentVideo: [],
            contentVideoS3Key: "",
            workshopUrl: "",
            workshopDescription: "",
            architectureDiagram: [],
            architectureDiagramS3Key: "",
            randomId: Math.floor(Math.random() * 1000000),
            quiz: [],
            quizS3Key: "",
            customContent: [],
            customContentS3Key: ""
        }
    }

    uploadContentVideo = async (file) => {
        if (!(file.type in ['video/mp4', 'video/mov'])) {
            console.log("TODO: content video content validation");
        }
        try {
            const s3Key = `lecture-videos/${this.state.randomId}-${file.name.replace(/ /g, "_")}`;
            await Storage.put(s3Key, file, {
                level: "protected",
            });
            this.setState({ contentVideoS3Key: s3Key })
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

    uploadCustomContent = async (file) => {
        if (!(file.type in ['text/plain'])) {
            console.log("TODO: custom content validation");
        }
        try {
            const s3Key = `custom-contents/${this.state.randomId}-${file.name.replace(/ /g, "_")}`;
            await Storage.put(s3Key, file, {
                level: "protected",
            });
            this.setState({ customContentS3Key: s3Key })
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

    resetCustomContent = async () => {
        if (this.state.customContentS3Key !== "") {
            await Storage.remove(this.state.customContentS3Key, {
                level: "protected"
            });
            this.setState({ customContentS3Key: "" });
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

    resetContentVideo = async () => {
        if (this.state.contentVideoS3Key !== "") {
            await Storage.remove(this.state.contentVideoS3Key, {
                level: "protected"
            });
            this.setState({ contentVideoS3Key: "" });
        }
    }


    // render 'Add Content' in step 2
    renderAddContent = () => {
        if (this.state.contentType === "Video") {
            return <FormField label="Content Videos" description="Theory video for content"
            >
                <FileUpload
                    onChange={
                        async ({ detail }) => {
                            this.setState({ contentVideo: detail.value });
                            if (detail.value.length === 0) {
                                this.resetContentVideo();
                            } else {
                                this.uploadContentVideo(detail.value[0]);
                            }
                        }
                    }
                    value={this.state.contentVideo}
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
        } else if (this.state.contentType === "Workshop") {
            return <div>
                <FormField
                    description="Workshop"
                    label="Hands-on lab for Content"
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
        } else if (this.state.contentType === "Quiz") {
            return <FormField
                label="Quiz"
                description="Add quiz questions"
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
        } else {
            return <FormField
                label="Customized"
                description="Add custom content"
            >
                <FileUpload
                    onChange={
                        async ({ detail }) => {
                            this.setState({ customContent: detail.value });
                            if (detail.value.length === 0) {
                                this.resetCustomContent();
                            } else {
                                this.uploadCustomContent(detail.value[0]);
                            }
                        }
                    }
                    value={this.state.customContent}
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
                    constraintText=".md"
                />
            </FormField>
        }
    }

    // render review section in step 3
    renderReviewSection = () => {
        if (this.state.contentType === "Video") {
            return <ColumnLayout
                columns={2}
                variant="text-grid"
            >
                <div>
                    <Box variant="awsui-key-label">
                        File name
                    </Box>
                    <div>{this.state.contentVideoS3Key}</div>
                </div>
            </ColumnLayout>
        } else if (this.state.contentType === "Workshop") {
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
        } else if (this.state.contentType === "Quiz") {
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
        } else {
            return <ColumnLayout
                columns={3}
                variant="text-grid"
            >
                <div>
                    <Box variant="awsui-key-label">
                        File name
                    </Box>
                    <div>{this.state.customContentS3Key}</div>
                </div>
            </ColumnLayout>
        }
    }

    render() {
        return (
            <>
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
                        this.resetContentVideo();
                        this.setState(this.getDefaultState());
                    }}
                    onNavigate={({ detail }) =>
                        this.setState({ activeStepIndex: detail.requestedStepIndex })
                    }
                    activeStepIndex={this.state.activeStepIndex}
                    steps={[
                        {
                            title: "Add Content Detail",
                            info: <Link variant="info">Info</Link>,
                            description:
                                "",
                            content: (
                                <Container
                                // header={
                                //     <Header variant="h2">
                                //         Content Detail
                                //     </Header>
                                // }
                                >
                                    <SpaceBetween direction="vertical" size="l">
                                        <FormField label="Content Title">
                                            <Input
                                                value={this.state.contentTitle}
                                                onChange={event =>
                                                    this.setState({ contentTitle: event.detail.value })
                                                }
                                            />
                                        </FormField>
                                        <FormField label="Content Description">
                                            <Input
                                                value={this.state.contentDescription}
                                                onChange={event =>
                                                    this.setState({ contentDescription: event.detail.value })
                                                } />
                                        </FormField>
                                        <FormField label="Content Type">
                                            <RadioGroup value={this.state.contentType}
                                                onChange={event => this.setState({ contentType: event.detail.value })}
                                                items={[
                                                    {
                                                        value: "Video",
                                                        label: "Video"
                                                    },
                                                    {
                                                        value: "Workshop",
                                                        label: "Workshop"
                                                    },
                                                    { value: "Quiz", label: "Quiz" },
                                                    { value: "Customized", label: "Customized" }
                                                ]}
                                            />
                                        </FormField>
                                    </SpaceBetween>
                                </Container>
                            )
                        },
                        {
                            title: "Upload Content",
                            content: (
                                <Container
                                // header={
                                //     <Header variant="h2">
                                //         Content
                                //     </Header>
                                // }
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
                                            Step 1: Add Content Detail
                                        </Header>
                                        <Container
                                            header={
                                                <Header variant="h2">
                                                    Content Detail
                                                </Header>
                                            }
                                        >
                                            <ColumnLayout
                                                columns={3}
                                                variant="text-grid"
                                            >
                                                <div>
                                                    <Box variant="awsui-key-label">
                                                        Content title
                                                    </Box>
                                                    <div>{this.state.contentTitle}</div>
                                                </div>
                                                <div>
                                                    <Box variant="awsui-key-label">
                                                        Description
                                                    </Box>
                                                    <div>{this.state.contentDescription}</div>
                                                </div>
                                                <div>
                                                    <Box variant="awsui-key-label">
                                                        Content Type
                                                    </Box>
                                                    <div>{this.state.contentType}</div>
                                                </div>
                                            </ColumnLayout>
                                        </Container>
                                    </SpaceBetween>
                                    <SpaceBetween size="xs">
                                        <Header
                                            variant="h3"
                                        >
                                            Step 2: Upload Content
                                        </Header>
                                        <Container
                                            header={
                                                <Header variant="h2">
                                                    Content File
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
            </>
        );
    }
}

export default (CreateContent);
