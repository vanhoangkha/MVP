import React, { useEffect, useState } from "react";
import {
  Modal,
  Table,
  Box,
  Button,
  TextFilter,
  Header,
  Pagination,
  SpaceBetween,
  ButtonDropdown,
  StatusIndicator,
  Alert,
  Flashbar,
} from "@cloudscape-design/components";
import Title from "../../../components/Title";
import { apiName, lecturePublicPath, lecturePath } from "../../../utils/api";
import { API, Storage } from "aws-amplify";
import { getMyLecturesService } from "../services/lecture";

const successMes = "Delete success";
const errorMess = "Error! An error occurred. Please try again later";

const MyLectures = () => {
  const [selectedItems, setSelectedItems] = React.useState([]);

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [disable, setDisable] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [flashItem, setFlashItem] = useState([]);

  const handleGetLectures = async () => {
    setLoading(true);

    // try {
    // const {data} = await getMyLecturesService()
    // setLectures(data)
    // setLoading(false)
    // } catch(_) {
    //   setLoading(false)
    // }
    try {
      const data = await API.get(apiName, lecturePublicPath);
      console.log(data);
      setLectures(data);
      setLoading(false);
    } catch (_) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetLectures();
  }, []);

  const handleClick = (value) => {
    switch (value.id) {
      case "rm":
        confirmDelete();
        break;
      case "edt":
        break;
      default:
        break;
    }
  };

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

  const deleteLecture = async () => {
    setDisable(true);
    setDeleting(true);
    let count = 0;
    let countDeleteItems = selectedItems.length;

    // selectedItems.map((item) => {
    //   await API.delete(apiName, lecturePublicPath + "/object/" + item.lectureId)
    // })
    for (let i = 0; i < countDeleteItems; i++) {
      if (selectedItems[i].Content) {
        deleteFile(selectedItems[i].Content)
          .then((res) => {
            deleteLectureInDB(selectedItems[i].ID, i)
              .then((res) => {
                count++;
                if ( count === countDeleteItems ) {
                  resetSuccess()
                }
              })
              .catch((error) => {
                resetFail();
                console.log(error);
              });
          })
          .catch((error) => {
            resetFail();
            console.log(error);
          });
      } else {
        deleteLectureInDB(selectedItems[i].ID, i)
          .then((res) => {
            count++;
            if ( count === countDeleteItems ) {
              resetSuccess()
            }
          })
          .catch((error) => {
            resetFail();
            console.log(error);
          });
      }
    }
  };

  const deleteFile = async (key) => {
    await Storage.remove(key, { level: "public" });
  };

  const deleteLectureInDB = async (id, index) => {
    await API.del(apiName, lecturePath + "/object/" + id);
    let lectureList = lectures;
    lectureList.splice(index, 1);
    setLectures(lectureList);
  };

  const confirmDelete = () => {
    setNoticeMessage("Are you sure deleting the lectures?");
    setVisible(true);
  };

  return (
    <>
      <Flashbar items={flashItem} />
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
            cell: (lecture) => lecture.Name,
            sortingField: "Name",
            isRowHeader: true,
          },
          {
            id: "updatedAt",
            header: "Last Updated",
            cell: (lecture) => lecture.updatedAt,
            sortingField: "updatedAt",
          },
          {
            id: "state",
            header: "State",
            cell: (lecture) =>
              lecture.state === "Enabled" ? (
                <StatusIndicator>{lecture.state}</StatusIndicator>
              ) : (
                <StatusIndicator type="error">{lecture.state}</StatusIndicator>
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
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <ButtonDropdown
                  items={[
                    {
                      text: "Edit",
                      id: "edt",
                      disabled: false,
                    },
                    {
                      text: "Delete",
                      id: "rm",
                      disabled: false,
                    },
                  ]}
                  onItemClick={(e) => handleClick(e.detail)}
                >
                  Actions
                </ButtonDropdown>
                <Button variant="primary" href="/#/createLecture">
                  Create Lecture
                </Button>
              </SpaceBetween>
            }
          >
            My Lectures
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
                onClick={() => deleteLecture()}
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

export default MyLectures;
