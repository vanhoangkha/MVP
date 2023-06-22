import React, { useEffect, useState } from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import SpaceBetween from "@cloudscape-design/components/space-between";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Title from "../../../components/Title";
import { getCoursesService } from "../services/course";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const [selectedItems, setSelectedItems] = React.useState([]);

  const [courses, setCourses] = useState([])

  const handleGetCouses = async () => {
    const {data} = await getCoursesService()

    console.log(data)
    setCourses(data)
  }

  useEffect(() => {
    handleGetCouses()
  },[])

  return (
    <>
      <Title text="My Courses" />
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
            //console.log(`selected item is: ${JSON.stringify(selectedItems.selectedItems[0].Name)}`)
            //console.log(`selected name is: ${JSON.parse(JSON.stringify(selectedItems))[0].Name}`)
            console.log(`isItemSelected is: ${JSON.stringify(selectedItems)}`)
            return `${item.Name} is ${isItemSelected ? "" : "not"} selected`;
          },
        }}
        columnDefinitions={[
          {
            id: "Name",
            header: "Course name",
            cell: (e) => e.Name,
            sortingField: "name",
            isRowHeader: true,
          },
          {
            id: "Last Updated",
            header: "Last Updated",
            cell: (e) => <span>{(new Date(e['Last Updated']).toDateString())}</span>,
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
          { id: "Last Updated", visible: true},
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
                <Link
                  to={{ pathname: `/assignCourse/${selectedItems.Name}`, state: {selectedItems} }}
                >
                  <Button>Assign Course</Button>
                </Link>
                
                <ButtonDropdown
                  items={[
                    {
                      text: "Deactivate",
                      id: "rm",
                      disabled: false,
                    },
                    {
                      text: "Activate",
                      id: "mv",
                      disabled: false,
                    },
                    {
                      text: "View details",
                      id: "rm",
                      disabled: false,
                    },
                    {
                      text: "Edit",
                      id: "mv",
                      disabled: false,
                    },
                    {
                      text: "Delete",
                      id: "rn",
                      disabled: false,
                    },
                  ]}
                >
                  Actions
                </ButtonDropdown>
                <Button variant="primary">Create Course</Button>
              </SpaceBetween>
            }
          >
            My Courses
          </Header>
        }
        pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
      />
    </>
  );
};

export default MyCourses;
