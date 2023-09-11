import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "video-react/dist/video-react.css";
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  ColumnLayout,
  ExpandableSection,
  Button,
} from "@cloudscape-design/components";

export default function CourseDetail(props) {
  const { state } = useLocation();
  const navigate  = useNavigate();
  return (
    <SpaceBetween size="s">
      <Container
        header={
          <Header
            variant="h2"
            actions={
              <Button
                onClick={() => navigate(`/editCourse/${state.ID}`, {
                  state: state,
                })}
              >
                Edit course
              </Button>
            }
          >
            Course Detail
          </Header>
        }
      >
        <SpaceBetween size="s">
          <div>
            <Box variant="awsui-key-label">Course Name</Box>
            <div>{state.Name}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">Course Description</Box>
            <div>{state.Description}</div>
          </div>
          <ColumnLayout columns={4} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">Course Publicity</Box>
              <div>{state.Publicity === 1 ? "Yes" : "No"}</div>
            </div>
            <div>
              <Box variant="awsui-key-label">Course Difficulty</Box>
              <div>{state.Difficulty ? "Yes" : "No"}</div>
            </div>
            <div>
              <Box variant="awsui-key-label">Category</Box>
              {state.Categories.map((category, index) => (
                <span key={index}>
                  {index !== 0 ? ", " : " "}
                  {category}
                </span>
              ))}
            </div>
            <div>
              <Box variant="awsui-key-label">Level</Box>
              <div>{state.Level}</div>
            </div>
          </ColumnLayout>
          <div>
            <Box variant="awsui-key-label">Requirements</Box>
            <div>
              <ol>
                {state.Requirements.map((item, index) => (
                  <div className="requirement-item">
                    <li className="requirement-item-haft" key={index}>
                      {item}
                    </li>
                  </div>
                ))}
              </ol>
            </div>
          </div>
          <div>
            <Box variant="awsui-key-label">What To Learn</Box>
            <div>
              <ol>
                {state.WhatToLearn.map((item, index) => (
                  <div className="requirement-item">
                    <li className="requirement-item-haft" key={index}>
                      {item}
                    </li>
                  </div>
                ))}
              </ol>
            </div>
          </div>
        </SpaceBetween>
      </Container>
      <Container header={<Header variant="h2">Course Chapters</Header>}>
        <ColumnLayout columns={1} variant="text-grid">
          <div className="lecture-list">
            <SpaceBetween size="xs">
              {state.Chapters.map((chapter, cIndex) => {
                return (
                  <>
                    <ExpandableSection
                      key={cIndex}
                      headerText={chapter.name}
                      variant="container"
                    >
                      <ul>
                        {chapter.lectures.map((item, index) => (
                          <li key={index}>{item.name}</li>
                        ))}
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
  );
}
