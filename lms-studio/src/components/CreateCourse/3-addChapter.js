import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import Applayout from '@cloudscape-design/components/app-layout';
import { useNavigate } from 'react-router-dom';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Wizard from '@cloudscape-design/components/wizard';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Button from '@cloudscape-design/components/button';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Textarea from '@cloudscape-design/components/textarea';
import Form from '@cloudscape-design/components/form';

const AddChapter = (props) => {
  const [activeHref, setActiveHref] = useState('myCourses');
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [value, setValue] = React.useState('');
  const [addChapterValue, setaddChapterValue] = React.useState('');
  return (
    <>
      <NavBar navigation={props.navigation} title="Cloud Academy" />
      <BreadcrumbGroup
        items={[
          { text: 'Home', href: '#' },
          { text: 'Course Management', href: '#components' },
        ]}
        ariaLabel="Breadcrumbs"
      />
      <div className="dashboard-main">
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
            submitButton: 'Launch instance',
            optional: 'optional',
          }}
          onNavigate={({ detail }) =>
            setActiveStepIndex(detail.requestedStepIndex)
          }
          activeStepIndex={activeStepIndex}
          allowSkipTo
          steps={[
            {
              title: 'Add Course Details',
              info: <Link variant="info">Info</Link>,

              content: (
                <form onSubmit={(e) => e.preventDefault()}>
                  <Form
                    actions={
                      <SpaceBetween direction="horizontal" size="xs">
                        <Button formAction="none" variant="link">
                          Cancel
                        </Button>
                        <Button variant="primary">Submit</Button>
                      </SpaceBetween>
                    }
                  >
                    <Container
                      header={
                        <Header variant="h2">
                          Add Course Details
                        </Header>
                      }
                    >
                      <SpaceBetween direction="vertical" size="l">
                        <FormField label="Add Course Details">
                          <Input
                            onChange={({ detail }) =>
                              setValue(detail.value)
                            }
                            value={value}
                            placeholder="Enter Course Details"
                          />
                        </FormField>
                      </SpaceBetween>
                    </Container>
                  </Form>
                </form>
              ),
            },
            {
              title: 'Add Requirements',
              content: (
                <Container
                  header={
                    <Header variant="h2">Add Requirements</Header>
                  }
                >
                  <SpaceBetween direction="vertical" size="l">
                    <FormField label="First field">
                      <Input
                        onChange={({ detail }) =>
                          setValue(detail.value)
                        }
                        value={value}
                        placeholder="Enter Additional Requirements"
                      />
                    </FormField>
                  </SpaceBetween>
                </Container>
              ),
              isOptional: true,
            },
            {
              title: 'Add Chapter',
              content: (
                <Container
                  header={<Header variant="h2">Add Chapter</Header>}
                >
                  <SpaceBetween direction="vertical" size="l">
                    <FormField label="Chapter Name">
                      <Input
                        onChange={({ detail }) =>
                          setValue(detail.value)
                        }
                        value={value}
                        placeholder="Add Chapter Name"
                      />
                    </FormField>
                  </SpaceBetween>
                  <SpaceBetween direction="horizontal">
                    {/* need to add on click to add new form field */}
                    <Button>+ Add</Button>
                  </SpaceBetween>
                </Container>
              ),
              isOptional: true,
            },
            {
              title: 'Review and Launch',
              content: (
                <SpaceBetween size="xs">
                  <Header
                    variant="h3"
                    actions={
                      <Button onClick={() => setActiveStepIndex(0)}>
                        Edit
                      </Button>
                    }
                  >
                    Step 1: Instance type
                  </Header>
                  <Container
                    header={
                      <Header variant="h2">Container title</Header>
                    }
                  >
                    <ColumnLayout columns={2} variant="text-grid">
                      <div>
                        <Box variant="awsui-key-label">
                          First field
                        </Box>
                        <div>Value</div>
                      </div>
                      <div>
                        <Box variant="awsui-key-label">
                          Second Field
                        </Box>
                        <div>Value</div>
                      </div>
                    </ColumnLayout>
                  </Container>
                </SpaceBetween>
              ),
            },
          ]}
        />
        <Footer />
      </div>
    </>
  );
};
// export default (Management);
export default AddChapter;
