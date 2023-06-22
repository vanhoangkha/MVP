import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { withAuthenticator } from "@aws-amplify/ui-react";
// import SideNavigation from "@cloudscape-design/components/side-navigation";
// import Applayout from "@cloudscape-design/components/app-layout";
// import { useNavigate } from "react-router-dom";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Wizard from "@cloudscape-design/components/wizard";

import Link from "@cloudscape-design/components/link";
import Box from "@cloudscape-design/components/box";

import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Button from "@cloudscape-design/components/button";

import ColumnLayout from "@cloudscape-design/components/column-layout";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Input from "@cloudscape-design/components/input";
import FormField from "@cloudscape-design/components/form-field";


const CreateLecture = (props) => {
  // const [activeHref, setActiveHref] = useState("myLectures");
  // const navigate = useNavigate();
  const [    activeStepIndex,    setActiveStepIndex  ] = React.useState(0);
  return (
    <>
      <NavBar navigation={props.navigation} title="Cloud Academy" />
      <BreadcrumbGroup
        items={[
          { text: "Home", href: "#" },
          { text: "Lecture", href: "#createLecture" },
          // {
          //   text: "Breadcrumb group",
          //   href: "#components/breadcrumb-group"
          // }
        ]}
        ariaLabel="Lecture"
      />






<Wizard      
    i18nStrings={
        {        stepNumberLabel: stepNumber =>          `Step ${stepNumber}`,
                collapsedStepsLabel: (stepNumber, stepsCount) =>          `Step ${stepNumber} of ${stepsCount}`,
                        skipToButtonLabel: (step, stepNumber) =>          `Skip to ${step.title}`,        navigationAriaLabel: "Steps",
                        cancelButton: "Cancel",        previousButton: "Previous",        nextButton: "Next",        submitButton: "Launch instance",        optional: "optional"      }}      onNavigate={({ detail }) =>        setActiveStepIndex(detail.requestedStepIndex)      }     
            activeStepIndex={activeStepIndex}     
            allowSkipTo      
            steps={[        
              {          
                title: "Add Lecture Detail",          
                info: <Link variant="info">Info</Link>,          
                description:            "Each instance type includes one or more instance sizes, allowing you to scale your resources to the requirements of your target workload.",         
                content: (            
                  <Container              
                  header={               
                     <Header variant="h2">                  
                     Form container header               
                    </Header>             
                     }            >             
                 <SpaceBetween direction="vertical" size="l">               
                  <FormField label="First field">                  <Input />                </FormField>                <FormField label="Second field">                  <Input />                </FormField>              </SpaceBetween>            </Container>          )        },        {          title: "Add storage",          content: (            <Container              header={                <Header variant="h2">                  Form container header                </Header>              }            >              <SpaceBetween direction="vertical" size="l">                <FormField label="First field">                  <Input />                </FormField>                <FormField label="Second field">                  <Input />                </FormField>              </SpaceBetween>            </Container>          ),          isOptional: true        },        {          title: "Configure security group",          content: (            <Container              header={                <Header variant="h2">                  Form container header                </Header>              }            >              <SpaceBetween direction="vertical" size="l">                <FormField label="First field">                  <Input />                </FormField>                <FormField label="Second field">                  <Input />                </FormField>              </SpaceBetween>            </Container>          ),          isOptional: true        },        {          title: "Review and launch",          content: (            <SpaceBetween size="xs">              <Header                variant="h3"                actions={                  <Button                    onClick={() => setActiveStepIndex(0)}                  >                    Edit                  </Button>                }              >                Step 1: Instance type              </Header>              <Container                header={                  <Header variant="h2">                    Container title                  </Header>                }              >                <ColumnLayout                  columns={2}                  variant="text-grid"                >                  <div>                    <Box variant="awsui-key-label">                      First field                    </Box>                    <div>Value</div>                  </div>                  <div>                    <Box variant="awsui-key-label">                      Second Field                    </Box>                    <div>Value</div>                  </div>                </ColumnLayout>              </Container>            </SpaceBetween>          )        }      ]}    />  








    </>
  );
};

export default withAuthenticator(CreateLecture);
