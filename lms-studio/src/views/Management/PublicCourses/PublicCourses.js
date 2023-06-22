import React, { useEffect, useState } from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import SpaceBetween from "@cloudscape-design/components/space-between";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Title from "../../../components/Title";
import { getPublicCoursesService } from "../services/course";

// const items = [
//   {
//     name: "AWS Course 1",
//     updatedAt: "2023/6",
//     state: "Enabled",
//   },
//   {
//     name: "AWS Course 2",
//     updatedAt: "2023/6",
//     state: "Disabled",
//   },
//   {
//     name: "AWS Course 3",
//     updatedAt: "2023/6",
//     state: "Enabled",
//   },
//   {
//     name: "AWS Course 4",
//     updatedAt: "2023/6",
//     state: "Enabled",
//   },
// ];

const PublicCourses = () => {
  const [selectedItems, setSelectedItems] = React.useState([]);

  const [courses, setCourses] = useState([])

  const handleGetCouses = async () => {
    const {data} = await getPublicCoursesService()

    console.log(data)
    setCourses(data)
  }

  useEffect(() => {
    handleGetCouses()
  },[])

  return (
    <>
      <Title text="Public Courses" />
      <Table
        onSelectionChange={({ detail }) =>
          setSelectedItems(detail.selectedItems)
        }
        selectedItems={selectedItems}
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          allItemsSelectionLabel: ({ selectedItems }) =>
            `${selectedItems.length} ${
              selectedItems.length === 1 ? "item" : "items"
            } selected`,
          itemSelectionLabel: ({ selectedItems }, item) => {
            const isItemSelected = selectedItems.filter(
              (i) => i.Name === item.Name
            ).length;
            const isItem = selectedItems.filter(
              (i) => i.Name === item.Name
            )
            //return `${item.Name} is ${isItemSelected ? "" : "not"} selected`;
            console.log(`isItemSelected is: ${JSON.stringify(selectedItems)}`)
            return `${item.Name} is ${isItemSelected ? "" : "not"} selected`;
          },
        }}
        columnDefinitions={[
          {
            id: "Name",
            header: "Course name",
            cell: (e) => e.Name,
            sortingField: "Name",
            isRowHeader: true,
          },
          {
            id: "updatedAt",
            header: "Last Updated",
            cell: (e) => e.updatedAt,
            sortingField: "updatedAt",
          },
          {
            id: "state",
            header: "State",
            cell: (e) =>
              e.state === "Enabled" ? (
                <StatusIndicator>{e.state}</StatusIndicator>
              ) : (
                <StatusIndicator type="error">{e.state}</StatusIndicator>
              ),
            sortingField: "state",
          },
        ]}
        columnDisplay={[
          { id: "Name", visible: true },
          { id: "updatedAt", visible: true },
          { id: "state", visible: true },
        ]}
        items={courses}
        loadingText="Loading resources"
        selectionType="multi"
        trackBy="Name"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No resources</b>
            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
              No resources to display.
            </Box>
            <Button>Create resource</Button>
          </Box>
        }
        filter={
          <TextFilter filteringPlaceholder="Find resources" filteringText="" />
        }
        header={
          <Header
            counter={
              selectedItems.length
                ? "(" + selectedItems.length + `/${courses.length})`
                : `(${courses.length})`
            }
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button>Assign</Button>
              </SpaceBetween>
            }
          >
            Public Courses
          </Header>
        }
        pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
      />
    </>
  );
};

export default PublicCourses;
