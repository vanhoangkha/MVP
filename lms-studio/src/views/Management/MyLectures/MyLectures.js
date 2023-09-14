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
  CollectionPreferences,
} from "@cloudscape-design/components";
import Title from "../../../components/Title";
import { apiName, lecturePublicPath, lecturePath } from "../../../utils/api";
import { API, Storage } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { transformDateTime } from "../../../utils/tool";
import { useCollection } from "@cloudscape-design/collection-hooks";
import { getMyLecturesService } from "../services/lecture";

const successMes = "Delete success";
const errorMess = "Error! An error occurred. Please try again later";

function EmptyState({ title, subtitle, action }) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {title}
      </Box>
      <Box variant="p" padding={{ bottom: "s" }} color="inherit">
        {subtitle}
      </Box>
      {action}
    </Box>
  );
}

const MyLectures = () => {
  const [selectedItems, setSelectedItems] = React.useState([]);

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [disable, setDisable] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [flashItem, setFlashItem] = useState([]);
  const [editDisable, setEditDisable] = useState(false);
  const [actionDisable, setActionDisable] = useState(true);
  const [currentLecture, setCurrentLecture] = useState();

  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    pageSize: 15,
    visibleContent: ["name", "updatedAt", "state", "actions"],
  });
  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(lectures, {
    filtering: {
      empty: <EmptyState title="No lectures" />,
      noMatch: (
        <EmptyState
          title="No matches"
          action={
            <Button onClick={() => actions.setFiltering("")}>
              Clear filter
            </Button>
          }
        />
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
  });

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
      setLectures(data);
      setLoading(false);
    } catch (_) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetLectures();
  }, []);

  const handleClick = (value, lecture) => {
    switch (value.id) {
      case "rm":
        confirmDelete();
        setCurrentLecture(lecture);
        break;
      case "edt":
        navigate(`/editLecture/${selectedItems[0]?.ID}`, {
          state: selectedItems[0],
        });
        break;
      case "edt1":
        navigate(`/editLecture/${lecture?.ID}`, {
          state: lecture,
        });
        break;
      case "detail":
        navigate(`/myLectures/detail/${lecture?.ID}`, {
          state: lecture,
        });
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
    let lectureList = lectures;
    let countDeleteItems = currentLecture ? 1 : selectedItems.length;
    let deleteItems = currentLecture ? currentLecture : selectedItems;

    for (let i = 0; i < countDeleteItems; i++) {
      try {
        if (deleteItems[i].Content) {
          await Storage.remove(deleteItems[i].Content, { level: "public" });
        }

        await API.del(apiName, lecturePath + "/object/" + deleteItems[i].ID);
        lectureList = lectureList.filter(
          (course) => course.ID != deleteItems[i].ID
        );
        if (i === countDeleteItems - 1) {
          resetSuccess();
          setLectures(lectureList);
        }
      } catch (error) {
        resetFail();
        console.log(error);
      }
    }
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
        {...collectionProps}
        onSelectionChange={({ detail }) => {
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
            //console.log(`item is ${isItemSelected}`);
            return `${item.Name} is ${isItemSelected ? "" : "not"} selected`;
          },
        }}
        columnDefinitions={[
          {
            id: "name",
            header: "Lecture name",
            cell: (lecture) => lecture.Name,
            sortingField: "Name",
            isRowHeader: true,
          },
          {
            id: "updatedAt",
            header: "Last Updated",
            cell: (lecture) =>
              lecture.LastUpdated ? transformDateTime(lecture.LastUpdated) : "",
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
                  { id: "rm", text: "Delete" },
                ]}
              />
            ),
          },
        ]}
        // columnDisplay={[
        //   { id: "name", visible: true },
        //   { id: "updatedAt", visible: true },
        //   { id: "state", visible: true },
        //   { id: "actions", visible: true },
        // ]}
        visibleColumns={preferences.visibleContent}
        items={items}
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
          <TextFilter {...filterProps} filteringPlaceholder="Find resources" />
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
                <Button variant="primary" href="/#/createLecture">
                  Create Lecture
                </Button>
              </SpaceBetween>
            }
          >
            My Lectures
          </Header>
        }
        pagination={<Pagination {...paginationProps} />}
        preferences={
          <CollectionPreferences
            title="Preferences"
            preferences={preferences}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            pageSizePreference={{
              title: "Page size",
              options: [
                { value: 15, label: "15 lectures" },
                { value: 20, label: "20 lectures" },
                { value: 25, label: "25 lectures" },
              ],
            }}
            visibleContentPreference={{
              title: "Select visible content",
              options: [
                {
                  label: "Main distribution properties",
                  options: [
                    {
                      id: "name",
                      label: "Lecture Name",
                      editable: false,
                    },
                    { id: "updatedAt", label: "Last Updated" },
                    { id: "state", label: "State" },
                    { id: "actions", label: "Actions" },
                  ],
                },
              ],
            }}
            onConfirm={({ detail }) => setPreferences(detail)}
          />
        }
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
                onClick={() => deleteLecture(selectedItems)}
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
