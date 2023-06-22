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
import { getMyLecturesService } from "../services/lecture";



const MyLectures = () => {
  const [selectedItems, setSelectedItems] = React.useState([]);

  const [lectures, setLectures] = useState([])

  const handleGetLectures = async () => {
    const {data} = await getMyLecturesService()

    console.log(data)
    setLectures(data)
  }

  useEffect(() => {
    handleGetLectures()
  },[])

  return (
    <>
      <Title text="My Lectures" />
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
            //console.log(`item is ${isItemSelected}`);
            return `${item.Name} is ${isItemSelected ? "" : "not"} selected`;
          },
        }}
        columnDefinitions={[
          {
            id: "Name",
            header: "Lecture name",
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
        items={lectures}
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
                ? "(" + selectedItems.length + `/${lectures.length})`
                : `(${lectures.length})`
            }
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <ButtonDropdown
                  items={[
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
                <Button variant="primary" href="/createLecture">Create Lecture</Button>
              </SpaceBetween>
            }
          >
            My Lectures
          </Header>
        }
        pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
      />
    </>
  );
};

export default MyLectures;
