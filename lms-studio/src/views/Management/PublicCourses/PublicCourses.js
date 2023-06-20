import React from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import SpaceBetween from "@cloudscape-design/components/space-between";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Title from "../../../components/Title";

const items = [
  {
    name: "AWS Course 1",
    updatedAt: "2023/6",
    state: "Enabled",
  },
  {
    name: "AWS Course 2",
    updatedAt: "2023/6",
    state: "Disabled",
  },
  {
    name: "AWS Course 3",
    updatedAt: "2023/6",
    state: "Enabled",
  },
  {
    name: "AWS Course 4",
    updatedAt: "2023/6",
    state: "Enabled",
  },
];

const PublicCourses = () => {
  const [selectedItems, setSelectedItems] = React.useState([]);

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
              (i) => i.name === item.name
            ).length;
            return `${item.name} is ${isItemSelected ? "" : "not"} selected`;
          },
        }}
        columnDefinitions={[
          {
            id: "name",
            header: "Course name",
            cell: (e) => e.name,
            sortingField: "name",
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
          { id: "name", visible: true },
          { id: "updatedAt", visible: true },
          { id: "state", visible: true },
        ]}
        items={items}
        loadingText="Loading resources"
        selectionType="multi"
        trackBy="name"
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
                ? "(" + selectedItems.length + `/${items.length})`
                : `(${items.length})`
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
