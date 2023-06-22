import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
// import { withAuthenticator } from '@aws-amplify/ui-react';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import Applayout from '@cloudscape-design/components/app-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Button from '@cloudscape-design/components/button';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

import { useNavigate } from 'react-router-dom';
const Leaderboard = (props) => {
  const [activeHref, setActiveHref] = useState('leaderboard');
  const [selectedItems, setSelectedItems] = React.useState([
    { name: 'Item 2' },
  ]);
  const navigate = useNavigate();
  return (
    <>
      <NavBar navigation={props.navigation} title="Cloud Academy" />

      <div className="dashboard-main">
        <Applayout
          navigation={
            <SideNavigation
              activeHref={activeHref}
              header={{ href: '/', text: 'Management' }}
              onFollow={(event) => {
                if (!event.detail.external) {
                  event.preventDefault();
                  const href =
                    event.detail.href === '/'
                      ? 'leaderboard'
                      : event.detail.href;
                  setActiveHref(href);
                  navigate(`/management/${href}`);
                }
              }}
              items={[
                {
                  type: 'section',
                  text: 'Lectures',
                  items: [
                    {
                      type: 'link',
                      text: 'My Lectures',
                      href: 'myLectures',
                    },
                    {
                      type: 'link',
                      text: 'Public Lectures',
                      href: 'publicLectures',
                    },
                  ],
                },
                {
                  type: 'section',
                  text: 'Courses',
                  items: [
                    {
                      type: 'link',
                      text: 'My Courses',
                      href: 'myCourses',
                    },
                    {
                      type: 'link',
                      text: 'Public Courses',
                      href: 'publicCourses',
                    },
                  ],
                },
                { type: 'link', text: 'User', href: 'user' },
                {
                  type: 'link',
                  text: 'Leaderboard',
                  href: 'leaderboard',
                },
              ]}
            />
          }
          content={
            <div>
              <ContentLayout
                header={
                  <SpaceBetween size="m">
                    <Header
                      variant="h1"
                      info={<Link>Info</Link>}
                      description="This is a generic description used in the header."
                      actions={
                        <Button variant="primary">Button</Button>
                      }
                    >
                      Top Contributors
                    </Header>

                    <Alert>This is a generic alert.</Alert>
                  </SpaceBetween>
                }
              >
                <Grid
                  gridDefinition={[
                    { colspan: { default: 4, xxs: 4 } },
                    { colspan: { default: 4, xxs: 4 } },
                    { colspan: { default: 4, xxs: 4 } },
                  ]}
                >
                  <div style={{ paddingTop: 60 }}>
                    <Container
                      media={{
                        content: (
                          <img
                            src="/image-placeholder.png"
                            alt="placeholder"
                          />
                        ),
                        height: 200,
                        position: 'top',
                      }}
                      footer={
                        <div className="container-media-footer">
                          <Link href="#">Internal link</Link>
                          <Button iconName="share" variant="icon" />
                        </div>
                      }
                    >
                      <SpaceBetween direction="vertical" size="s">
                        <SpaceBetween direction="vertical" size="xxs">
                          <Box variant="small">March 10, 2023</Box>
                          <Box variant="h2">Contributor 1</Box>
                        </SpaceBetween>
                        This is a paragraph.
                        <Button>Go to Course</Button>
                      </SpaceBetween>
                    </Container>
                  </div>
                  <div style={{ paddingTop: 60 }}>
                    <Container
                      media={{
                        content: (
                          <img
                            src="/image-placeholder.png"
                            alt="placeholder"
                          />
                        ),
                        height: 200,
                        position: 'top',
                      }}
                      footer={
                        <div className="container-media-footer">
                          <Link href="#">Internal link</Link>
                          <Button iconName="share" variant="icon" />
                        </div>
                      }
                    >
                      <SpaceBetween direction="vertical" size="s">
                        <SpaceBetween direction="vertical" size="xxs">
                          <Box variant="small">March 10, 2023</Box>
                          <Box variant="h2">Contributor 2</Box>
                        </SpaceBetween>
                        This is a paragraph.
                        <Button>Primary action</Button>
                      </SpaceBetween>
                    </Container>
                  </div>
                  <div style={{ paddingTop: 60 }}>
                    <Container
                      media={{
                        content: (
                          <img
                            src="/image-placeholder.png"
                            alt="placeholder"
                          />
                        ),
                        height: 200,
                        position: 'top',
                      }}
                      footer={
                        <div className="container-media-footer">
                          <Link href="#">Internal link</Link>
                          <Button iconName="share" variant="icon" />
                        </div>
                      }
                    >
                      <SpaceBetween direction="vertical" size="s">
                        <SpaceBetween direction="vertical" size="xxs">
                          <Box variant="small">March 10, 2023</Box>
                          <Box variant="h2">Contributor 3</Box>
                        </SpaceBetween>
                        This is a paragraph.
                        <Button>Primary action</Button>
                      </SpaceBetween>
                    </Container>
                  </div>
                </Grid>
              </ContentLayout>
              <Outlet />
              <div style={{ paddingTop: 32 }}>
                <Table
                  onSelectionChange={({ detail }) =>
                    setSelectedItems(detail.selectedItems)
                  }
                  selectedItems={selectedItems}
                  ariaLabels={{
                    selectionGroupLabel: 'Items selection',
                    allItemsSelectionLabel: ({ selectedItems }) =>
                      `${selectedItems.length} ${
                        selectedItems.length === 1 ? 'item' : 'items'
                      } selected`,
                    itemSelectionLabel: ({ selectedItems }, item) => {
                      const isItemSelected = selectedItems.filter(
                        (i) => i.name === item.name
                      ).length;
                      return `${item.name} is ${
                        isItemSelected ? '' : 'not'
                      } selected`;
                    },
                  }}
                  columnDefinitions={[
                    {
                      id: 'contributorName',
                      header: 'Contributor Name',
                      cell: (e) => e.name,
                      sortingField: 'name',
                      isRowHeader: true,
                    },
                    {
                      id: 'lecture',
                      header: 'Lecture',
                      cell: (e) => e.alt,
                      sortingField: 'alt',
                    },
                    {
                      id: 'course',
                      header: 'Course',
                      cell: (e) => e.type,
                    },
                    {
                      id: 'description',
                      header: 'Description',
                      cell: (e) => e.description,
                    },
                    {
                      id: 'userRating',
                      header: 'userRating',
                      cell: (e) => e.userRating,
                      sortingField: 'userRating',
                    },
                  ]}
                  columnDisplay={[
                    { id: 'contributorName', visible: true },
                    { id: 'lecture', visible: true },
                    { id: 'course', visible: true },
                    { id: 'description', visible: true },
                    { id: 'userRating', visible: true },
                  ]}
                  items={[
                    {
                      name: 'Name 1',
                      alt: 'First',
                      description: 'This is the first item',
                      type: '1A',
                      size: 'Small',
                      userRating: '5 out of 5',
                    },
                    {
                      name: 'Name 2',
                      alt: 'Second',
                      description: 'This is the second item',
                      type: '1B',
                      size: 'Large',
                      userRating: '4.8 out of 5',
                    },
                    {
                      name: 'Name 3',
                      alt: 'Third',
                      description: '-',
                      type: '1A',
                      size: 'Large',
                      userRating: '4.9 out of 5',
                    },
                    {
                      name: 'Name 4',
                      alt: 'Fourth',
                      description: 'This is the fourth item',
                      type: '2A',
                      size: 'Small',
                      userRating: '5 out of 5',
                    },
                    {
                      name: 'Name 5',
                      alt: '-',
                      description:
                        'This is the fifth item with a longer description',
                      type: '2A',
                      size: 'Large',
                      userRating: '4.6 out of 5',
                    },
                    {
                      name: 'Name 6',
                      alt: 'Sixth',
                      description: 'This is the sixth item',
                      type: '1A',
                      size: 'Small',
                      userRating: '4.3 out of 5',
                    },
                  ]}
                  loadingText="Loading resources"
                  selectionType="multi"
                  trackBy="name"
                  empty={
                    <Box textAlign="center" color="inherit">
                      <b>No resources</b>
                      <Box
                        padding={{ bottom: 's' }}
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
                      filteringPlaceholder="Find Contributors"
                      filteringText=""
                    />
                  }
                  header={
                    <Header
                      counter={
                        selectedItems.length
                          ? '(' + selectedItems.length + '/10)'
                          : '(10)'
                      }
                    >
                      All Contributors
                    </Header>
                  }
                  pagination={
                    <Pagination currentPageIndex={1} pagesCount={2} />
                  }
                  preferences={
                    <CollectionPreferences
                      title="Preferences"
                      confirmLabel="Confirm"
                      cancelLabel="Cancel"
                      preferences={{
                        pageSize: 10,
                        contentDisplay: [
                          { id: 'contributorName', visible: true },
                          { id: 'lecture', visible: true },
                          { id: 'course', visible: true },
                          { id: 'description', visible: true },
                          { id: 'userRating', visible: true },
                        ],
                      }}
                      pageSizePreference={{
                        title: 'Page size',
                        options: [
                          { value: 10, label: '10 resources' },
                          { value: 20, label: '20 resources' },
                        ],
                      }}
                      wrapLinesPreference={{}}
                      stripedRowsPreference={{}}
                      contentDensityPreference={{}}
                      contentDisplayPreference={{
                        options: [
                          {
                            id: 'contributorName',
                            label: 'Contributor Name',
                            alwaysVisible: true,
                          },
                          { id: 'lecture', label: 'Lecture' },
                          { id: 'course', label: 'Course' },
                          { id: 'description', label: 'Description' },
                          { id: 'userRating', label: 'userRating' },
                        ],
                      }}
                      stickyColumnsPreference={{
                        firstColumns: {
                          title: 'Stick first column(s)',
                          description:
                            'Keep the first column(s) visible while horizontally scrolling the table content.',
                          options: [
                            { label: 'None', value: 0 },
                            { label: 'First column', value: 1 },
                            { label: 'First two columns', value: 2 },
                          ],
                        },
                        lastColumns: {
                          title: 'Stick last column',
                          description:
                            'Keep the last column visible while horizontally scrolling the table content.',
                          options: [
                            { label: 'None', value: 0 },
                            { label: 'Last column', value: 1 },
                          ],
                        },
                      }}
                    />
                  }
                />
              </div>
            </div>
          }
        />
        <Footer />
      </div>
    </>
  );
};
// export default withAuthenticator(Leaderboard);
export default Leaderboard;
