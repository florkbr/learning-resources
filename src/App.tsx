import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import {
  LoadingBox,
  QuickStart,
  QuickStartContext,
  QuickStartContextValues,
  filterQuickStarts,
} from '@patternfly/quickstarts';
import {
  Divider,
  EmptyState,
  PageGroup,
  PageSection,
  Pagination,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  StackItem,
} from '@patternfly/react-core';
import CatalogHeader from './components/CatalogHeader';
import CatalogFilter from './components/CatalogFilter';
import CatalogSection from './components/CatalogSection';
import TableOfContents from './components/TableOfContents';
import { BookmarkIcon, OutlinedBookmarkIcon } from '@patternfly/react-icons';
import { useFlag } from '@unleash/proxy-client-react';

const sortFnc = (q1: QuickStart, q2: QuickStart) =>
  q1.spec.displayName.localeCompare(q2.spec.displayName);

export const App = ({ bundle }: { bundle: string }) => {
  const {
    activeQuickStartID,
    allQuickStartStates,
    allQuickStarts = [],
    filter,
    setFilter,
    loading,
  } = React.useContext<QuickStartContextValues>(QuickStartContext);
  const showBookmarks = useFlag('platform.learning-resources.bookmarks');
  const [pagination, setPagination] = useState({
    count: 321,
    perPage: 20,
    page: 1,
  });
  const [contentReady, setContentReady] = useState(false);
  const [size, setSize] = useState(window.innerHeight);

  const { documentation, learningPaths, other, quickStarts, bookmarks } =
    useMemo(() => {
      const filteredQuickStarts = filterQuickStarts(
        allQuickStarts || [],
        filter?.keyword || '',
        filter?.status?.statusFilters,
        allQuickStartStates || {}
      ).sort(sortFnc);
      return filteredQuickStarts.reduce<{
        bookmarks: QuickStart[];
        documentation: QuickStart[];
        quickStarts: QuickStart[];
        other: QuickStart[];
        learningPaths: QuickStart[];
      }>(
        (acc, curr) => {
          if (curr.metadata.externalDocumentation) {
            acc.documentation.push(curr);
          } else if (curr.metadata.otherResource) {
            acc.other.push(curr);
          } else if (curr.metadata.learningPath) {
            acc.learningPaths.push(curr);
          } else if (curr.metadata.bookmarks) {
            acc.bookmarks.push(curr);
          } else {
            acc.quickStarts.push(curr);
          }

          return acc;
        },
        {
          documentation: [],
          quickStarts: [],
          other: [],
          learningPaths: [],
          bookmarks: [],
        }
      );
    }, [allQuickStarts, filter]);

  const quickStartsCount =
    quickStarts.length +
    documentation.length +
    learningPaths.length +
    other.length;

  const chrome = useChrome();

  const { quickStarts: quickStartsApi } = chrome;
  const targetBundle = bundle || 'settings';

  chrome?.updateDocumentTitle?.('Learning Resources');
  useEffect(() => {
    chrome?.hideGlobalFilter?.(true);
  }, []);

  useEffect(() => {
    fetch(`/api/quickstarts/v1/quickstarts?bundle=${targetBundle}`)
      .then<{ data: { content: QuickStart }[] }>((response) => response.json())
      .then(({ data }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        quickStartsApi.set(
          `${targetBundle}`,
          data.map(({ content }) => content)
        );
        setContentReady(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const onSearchInputChange = (searchValue: string) => {
    setFilter('keyword', searchValue);
  };

  React.useLayoutEffect(() => {
    function updateSize() {
      setSize(
        window.innerHeight -
          (document.querySelector('header')?.getBoundingClientRect()?.height ||
            0)
      );
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!contentReady || loading) {
    return <LoadingBox />;
  }

  return (
    <PageGroup id="learning-resources-wrapper" style={{ height: `${size}px` }}>
      <PageSection className="pf-u-p-lg lr-c-catalog__header">
        <StackItem className="pf-u-mb-md">
          <CatalogHeader />
        </StackItem>
        <StackItem>
          <CatalogFilter
            quickStartsCount={quickStartsCount}
            onSearchInputChange={onSearchInputChange}
          />
        </StackItem>
      </PageSection>
      <PageSection className="pf-u-background-color-200 pf-m-fill">
        <div className="pf-v5-u-h-100">
          <Sidebar id="content-wrapper" isPanelRight hasGutter>
            <SidebarContent
              id="quick-starts"
              className="pf-u-background-color-200"
            >
              {showBookmarks && (
                <React.Fragment>
                  <CatalogSection
                    sectionName="bookmarked"
                    sectionCount={bookmarks.length}
                    emptyBody={
                      <EmptyState className="lr-c-empty_bookmarks">
                        No bookmarked resources yet. Click the{' '}
                        <OutlinedBookmarkIcon /> icon to pin it to your
                        bookmarks here.
                      </EmptyState>
                    }
                    sectionTitle={
                      <span>
                        <span className="lr-c-header-icon">
                          <BookmarkIcon />
                        </span>
                        Bookmarks
                      </span>
                    }
                    rightTitle={
                      <Pagination
                        itemCount={bookmarks.length}
                        perPage={pagination.perPage}
                        page={pagination.page}
                        onSetPage={(_e, perPage) =>
                          setPagination((pagination) => ({
                            ...pagination,
                            perPage,
                            page: 1,
                          }))
                        }
                        widgetId="pagination-options-menu-top"
                        onPerPageSelect={(_e, page) =>
                          setPagination((pagination) => ({
                            ...pagination,
                            page,
                          }))
                        }
                        isCompact
                      />
                    }
                    isExpandable={false}
                    sectionQuickStarts={bookmarks.slice(
                      (pagination.page - 1) * pagination.perPage,
                      pagination.page * (pagination.perPage - 1)
                    )}
                    activeQuickStartID={activeQuickStartID}
                    allQuickStartStates={allQuickStartStates}
                  />
                  <Divider className="pf-u-mt-lg pf-u-mb-lg" />
                </React.Fragment>
              )}
              <CatalogSection
                sectionName="documentation"
                sectionCount={documentation.length}
                sectionTitle="Documentation"
                sectionDescription="Technical information for using the service"
                sectionQuickStarts={documentation}
                activeQuickStartID={activeQuickStartID}
                allQuickStartStates={allQuickStartStates}
              />
              <Divider className="pf-u-mt-lg pf-u-mb-lg" />
              <CatalogSection
                sectionName="quick-starts"
                sectionCount={quickStarts.length}
                sectionTitle="Quick starts"
                sectionDescription="Step-by-step instructions and tasks"
                sectionQuickStarts={quickStarts}
                activeQuickStartID={activeQuickStartID}
                allQuickStartStates={allQuickStartStates}
              />
              <Divider className="pf-u-mt-lg pf-u-mb-lg" />
              <CatalogSection
                sectionName="learning-paths"
                sectionCount={learningPaths.length}
                sectionTitle="Learning paths"
                sectionDescription="Collections of learning materials contributing to a common use case"
                sectionQuickStarts={learningPaths}
                activeQuickStartID={activeQuickStartID}
                allQuickStartStates={allQuickStartStates}
              />
              <Divider className="pf-u-mt-lg pf-u-mb-lg" />
              <CatalogSection
                sectionName="other"
                sectionCount={other.length}
                sectionTitle="Other content types"
                sectionDescription="Tutorials, videos, e-books, and more to help you build your skills"
                sectionQuickStarts={other}
                activeQuickStartID={activeQuickStartID}
                allQuickStartStates={allQuickStartStates}
              />
            </SidebarContent>
            <SidebarPanel
              variant="sticky"
              className="pf-u-background-color-200 pf-u-pl-lg pf-u-pl-0-on-lg"
            >
              <TableOfContents
                defaultActive="documentation"
                linkItems={[
                  {
                    id: 'documentation',
                    label: `Documentation (${documentation.length})`,
                  },
                  {
                    id: 'quick-starts',
                    label: `Quick starts (${quickStarts.length})`,
                  },
                  {
                    id: 'learning-paths',
                    label: `Learning paths (${learningPaths.length})`,
                  },
                  {
                    id: 'other-content-types',
                    label: `Other content types (${other.length})`,
                  },
                ]}
              />
            </SidebarPanel>
          </Sidebar>
        </div>
      </PageSection>
    </PageGroup>
  );
};
