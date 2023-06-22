import React, { useEffect, useState } from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Title from "../../../components/Title";
import { getPublicLecturesService } from "../services/lecture";

// const items = [
//   {
//     name: "AWS Lecture 1",
//     updatedAt: "2023/6",
//     state: "Enabled",
//   },
//   {
//     name: "AWS Lecture 2",
//     updatedAt: "2023/6",
//     state: "Disabled",
//   },
//   {
//     name: "AWS Lecture 3",
//     updatedAt: "2023/6",
//     state: "Enabled",
//   },
//   {
//     name: "AWS Lecture 4",
//     updatedAt: "2023/6",
//     state: "Enabled",
//   },
// ];

const PublicLectures = () => {
  const [selectedItems, setSelectedItems] = React.useState([]);

  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(false)

  const handleGetLectures = async () => {
    setLoading(true)

    try {
    const {data} = await getPublicLecturesService()
    setLectures(data)
    setLoading(false)
    } catch(_) {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetLectures()
  },[])

  return (
    <>
      <Title text="Public Lectures" />
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
            return `${item.Name} is ${isItemSelected ? "" : "not"} selected`;
          },
        }}
        columnDefinitions={[
          {
            id: "Name",
            header: "Lecture name",
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
          { id: "updatedAt", visible: true },
          { id: "state", visible: true },
        ]}
        items={lectures}
        loading={loading}
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
          >
            Public Lectures
          </Header>
        }
        pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
      />
    </>
  );
};

export default PublicLectures;
