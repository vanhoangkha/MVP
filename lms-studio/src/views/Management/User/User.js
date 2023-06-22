import React from "react";
import Tabs from "@cloudscape-design/components/tabs";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import SpaceBetween from "@cloudscape-design/components/space-between";


const User = () => {
//   const [selectedItems, setSelectedItems] = React.useState([]);
const [
    selectedItems,
    setSelectedItems
  ] = React.useState([{ name: "Item 2" }]);

  return (
    <Tabs
      tabs={[
        {
          label: "Overview",
          id: "first",
          content: 
            <Container
            header={
                <Header
                variant="h2"
                // description="Container description"
                >
                    Overview
                </Header>
            }
            >

                <Container 
                    header={
                        <Header
                        variant="h2"
                        description="Amount of courses"
                        >
                        </Header>
                    }
                >
                    No of course - 4
                </Container>
            <br></br>
                <Container 
                    header={
                        <Header
                        variant="h2"
                        description="Amount of users"
                        >
                        </Header>
                    }
                >
                    No of users - 200
                </Container>
            <br></br>
            <Container 
                header={
                    <Header
                    variant="h2"
                    description="Amount of resources"
                    >
                    </Header>
                }
            >
                No of resources - 56
            </Container>

            <br></br>
            <Container 
                header={
                    <Header
                    variant="h2"
                    description="Most popular courses"
                    >
                    </Header>
                }
            >
                AWS courses X
            </Container>
            </Container>
          
        },
        {
          label: "Users",
          id: "second",
          content: 



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
                i => i.name === item.name
                ).length;
                return `${item.name} is ${
                isItemSelected ? "" : "not"
                } selected`;
            }
            }}
            columnDefinitions={
                [
                    {
                        id: "username",
                        header: "User name",
                        cell: e => e.name,
                        sortingField: "name",
                        isRowHeader: true
                    },
                    {
                        id: "amountOfCourses",
                        header: "Amount of Courses",
                        cell: e => e.aoc,
                        sortingField: "amc"
                    },
                    {   id: "avgProgress", 
                        header: "Average Progress",
                        cell: e => e.ap 
                    },
            
                ]
            }
            columnDisplay={[
            { id: "username", visible: true },
            { id: "amountOfCourses", visible: true },
            { id: "avgProgress", visible: true }
            ]}
            items={[
            {
                name: "User 1",
                aoc: "15",
                ap: "45%",
            },
            
            ]}
            loadingText="Loading resources"
            selectionType="multi"
            trackBy="name"
            empty={
            <Box textAlign="center" color="inherit">
                <b>No resources</b>
                <Box
                padding={{ bottom: "s" }}
                variant="p"
                color="inherit"
                >
                No resources to display.
                </Box>
                <Button>Create resource</Button>
            </Box>
            }
            filter={
            <TextFilter
                filteringPlaceholder="Type the exact username"
                filteringText=""
            />
            }


            header={
                <Header
                //   counter={
                //     selectedItems.length
                //       ? "(" + selectedItems.length + "/10)"
                //       : "(10)"
                //   }
                  actions={
                    <SpaceBetween
                      direction="horizontal"
                      size="xs"
                    >
                     
                      <Button>Edit</Button>
                      <Button variant="primary">
                        Delete
                      </Button>
                    </SpaceBetween>
                  }
                >
                  Check User
                </Header>
              }


            // pagination={
            // <Pagination currentPageIndex={1} pagesCount={2} />
            // }
            preferences={
            <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                preferences={{
                pageSize: 10,
                contentDisplay: [
                    { id: "variable", visible: true },
                    { id: "value", visible: true },
                    { id: "type", visible: true },
                    { id: "description", visible: true }
                ]
                }}
                pageSizePreference={{
                title: "Page size",
                options: [
                    { value: 10, label: "10 resources" },
                    { value: 20, label: "20 resources" }
                ]
                }}
                wrapLinesPreference={{}}
                stripedRowsPreference={{}}
                contentDensityPreference={{}}
                contentDisplayPreference={{
                options: [
                    {
                    id: "variable",
                    label: "Variable name",
                    alwaysVisible: true
                    },
                    { id: "value", label: "Text value" },
                    { id: "type", label: "Type" },
                    { id: "description", label: "Description" }
                ]
                }}
                stickyColumnsPreference={{
                firstColumns: {
                    title: "Stick first column(s)",
                    description:
                    "Keep the first column(s) visible while horizontally scrolling the table content.",
                    options: [
                    { label: "None", value: 0 },
                    { label: "First column", value: 1 },
                    { label: "First two columns", value: 2 }
                    ]
                },
                lastColumns: {
                    title: "Stick last column",
                    description:
                    "Keep the last column visible while horizontally scrolling the table content.",
                    options: [
                    { label: "None", value: 0 },
                    { label: "Last column", value: 1 }
                    ]
                }
                }}
            />
            }
            />










        }
      ]}
    />
  );

};

export default User;
