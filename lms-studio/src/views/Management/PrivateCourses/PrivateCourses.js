import React, { useEffect, useState } from "react";
import {
  StatusIndicator,
  SpaceBetween,
  Pagination,
  Header,
  TextFilter,
  Button,
  Box,
  Table,
  Flashbar,
  ButtonDropdown,
  Modal,
} from "@cloudscape-design/components"
import Title from "../../../components/Title";
import { getPublicCoursesService } from "../services/course";
import { apiName, coursePath } from "../../../utils/api";
import { API } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";

const successMes = "Delete success";
const errorMess = "Error! An error occurred. Please try again later";

const PrivateCourses = () => {
  const [selectedItems, setSelectedItems] = React.useState([]);

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [disable, setDisable] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [flashItem, setFlashItem] = useState([]);
  const [editDisable, setEditDisable] = useState(false);
  const [actionDisable, setActionDisable] = useState(true);
  const [currentCourse, setCurrentCourse] = useState();

  const navigate  = useNavigate()

  const handleGetCouses = async () => {
    setLoading(true)

    // try {
    // const {data} = await getPublicCoursesService()
    // setCourses(data)
    // setLoading(false)
    // } catch(_) {
    //   setLoading(false)
    // }
    try {
      const data = await API.get(apiName, coursePath + "/private")
      setCourses(data)
      console.log(data)
      setLoading(false)
    }catch(_) {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetCouses()
  },[])

  const handleClick = (value, course) => {
    switch (value.id) {
      case "rm":
        confirmDelete();
        if ( course ) {
          setCurrentCourse(course)
        }
        break;
      case "edt":
        navigate(`/editCourse/${selectedItems[0]?.ID}`, {
          state: selectedItems[0],
        });
        break;
      case "edt1":
        navigate(`/editCourse/${course?.ID}`, {
          state: course,
        });
        break;
      case "detail":
        navigate(`/myCourses/detail/${course?.ID}`, {
          state: course,
        });
        break;
      default:
        break;
    }
  };

  const confirmDelete = () => {
    setNoticeMessage("Are you sure deleting the courses?");
    setVisible(true);
  };

  const handleOpenAssignCoures = () => {
    navigate(`assignCourse/${selectedItems[0]?.ID}`, {state: selectedItems[0]})
  }

  const resetFail = () => {
    setDeleting(false);
    setDisable(false);
    setVisible(false);
    setFlashItem([
      {
        type: "error",
        content: errorMess,
        dismissible: true,
        dismissLabel: "Dismiss message",
        onDismiss: () => setFlashItem([]),
        id: "error_message",
      },
    ]);
  };

  const resetSuccess = () => {
    setDisable(false);
    setDeleting(false);
    setVisible(false);
    setFlashItem([
      {
        type: "success",
        content: successMes,
        dismissible: true,
        dismissLabel: "Dismiss message",
        onDismiss: () => setFlashItem([]),
        id: "success_message",
      },
    ]);
    setSelectedItems([]);
  };

  const deleteCourse = async () => {
    setDisable(true);
    setDeleting(true);
    let courseList = courses;
    let countDeleteItems = currentCourse ? 1 : selectedItems.length;
    const deteleItems = currentCourse ? currentCourse : selectedItems
    for (let i = 0; i < countDeleteItems; i++) {
      try {
        await API.del(apiName, coursePath + "/object/" + deteleItems[i].ID);
        courseList = courseList.filter(course => course.ID != deteleItems[i].ID);
        if ( i === countDeleteItems - 1){
          resetSuccess();
          setCourses(courseList);
        }
      }catch(error){
        resetFail();
        console.log(error);
      }
    }
  }

  return (
    <>
      <Flashbar items={flashItem} />
      <Title text="Public Courses" />
      <Table
        onSelectionChange={({ detail }) =>{
          if (detail.selectedItems.length > 1) {
            setEditDisable(true);
          }
          detail.selectedItems.length > 0
            ? setActionDisable(false)
            : setActionDisable(true);
          setSelectedItems(detail.selectedItems);
        }}
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
            //console.log(`isItemSelected is: ${JSON.stringify(selectedItems)}`)
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
          {
            id: "actions",
            header: "Actions",
            minWidth: 100,
            cell: (item) => (
              <ButtonDropdown
                ariaLabel="Control lecture"
                variant="inline-icon"
                expandToViewport={true}
                onItemClick={(e) => handleClick(e.detail, item)}
                items={[
                  { id: "detail", text: "View details" },
                  { id: "edt1", text: "Edit" },
                  { id: "rm", text: "Delete"},
                ]}
              />
            ),
          },
        ]}
        columnDisplay={[
          { id: "Name", visible: true },
          { id: "updatedAt", visible: true },
          { id: "state", visible: true },
          { id: "actions", visible: true },
        ]}
        items={courses}
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
                ? "(" + selectedItems.length + `/${courses.length})`
                : `(${courses.length})`
            }
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <ButtonDropdown
                  items={[
                    {
                      text: "Edit",
                      id: "edt",
                      disabled: editDisable,
                    },
                    {
                      text: "Delete",
                      id: "rm",
                      disabled: false,
                    },
                  ]}
                  disabled={actionDisable}
                  onItemClick={(e) => handleClick(e.detail)}
                >
                  Actions
                </ButtonDropdown>
                <Button disabled={selectedItems.length > 0 ? false : true} onClick={handleOpenAssignCoures}>Assign</Button>
              </SpaceBetween>
            }
          >
            Public Courses
          </Header>
        }
        pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
      />
      <Modal
        onDismiss={() => setVisible(false)}
        visible={visible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setVisible(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disable={disable}
                loading={deleting}
                onClick={() => deleteCourse()}
              >
                Delete
              </Button>
            </SpaceBetween>
          </Box>
        }
        header="Confirm"
      >
        {noticeMessage}
      </Modal>
    </>
  );
};

export default PrivateCourses;
