import React from 'react';
import { Spinner, Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import './GlobalLearningResourcesTabs.scss';
import fetchQuickstarts from '../../utils/fetchQuickstarts';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { QuickStart } from '@patternfly/quickstarts';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { TabsEnum } from '../../utils/TabsEnum';
import { UnwrappedLoader } from '@redhat-cloud-services/frontend-components-utilities/useSuspenseLoader';

interface GlobalLearningResourcesTabsProps {
  loader?: UnwrappedLoader<typeof fetchQuickstarts>;
}

const GlobalLearningResourcesTabs: React.FC<
  GlobalLearningResourcesTabsProps
> = ({ loader }) => {
  const [searchParams] = useSearchParams();
  const chrome = useChrome();
  const quickStarts: QuickStart[] = loader?.(chrome.auth.getUser) ?? [];

  const bookmarkedResourcesCount = quickStarts.reduce(
    (acc, cur) => (cur.metadata.favorite ? acc + 1 : acc),
    0
  );

  return (
    <Tabs
      aria-label="Tab"
      role="region"
      className="lr-c-global-learning-resources-tabs pf-v5-u-pt-md pf-v5-u-pl-xl"
      activeKey={searchParams.get('tab')!}
    >
      <Tab
        eventKey="all"
        title={
          <Link
            className="lr-c-global-learning-resources-tabs__link"
            to={{
              pathname: '.',
              search: `?tab=${TabsEnum.All}`,
            }}
          >
            <TabTitleText className="lr-c-global-learning-resources-tabs__title">
              All learning resources (
              {!loader ? <Spinner size="md" /> : quickStarts.length})
            </TabTitleText>
          </Link>
        }
        tabContentId="refTabResources"
      />
      <Tab
        eventKey="bookmarks"
        title={
          <Link
            className="lr-c-global-learning-resources-tabs__link"
            to={{
              pathname: '.',
              search: `?tab=${TabsEnum.Bookmarks}`,
            }}
          >
            <TabTitleText className="lr-c-global-learning-resources-tabs__title">
              My bookmarked resources (
              {!loader ? <Spinner size="md" /> : bookmarkedResourcesCount})
            </TabTitleText>
          </Link>
        }
        tabContentId="refTabBookmarks"
      />
    </Tabs>
  );
};

export default GlobalLearningResourcesTabs;
