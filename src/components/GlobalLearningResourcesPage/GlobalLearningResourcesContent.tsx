import React, { useEffect } from 'react';
import { GalleryItem, TabContent } from '@patternfly/react-core';
import './GlobalLearningResourcesContent.scss';
import { Bullseye, Gallery } from '@patternfly/react-core';
import { QuickStart } from '@patternfly/quickstarts';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/dynamic/icons/cubes-icon';
import GlobalLearningResourcesQuickstartItem from './GlobalLearningResourcesQuickstartItem';
import { useSearchParams } from 'react-router-dom';
import { UnwrappedLoader } from '@redhat-cloud-services/frontend-components-utilities/useSuspenseLoader';
import { TabsEnum } from '../../utils/TabsEnum';
import fetchAllData from '../../utils/fetchAllData';

interface GlobalLearningResourcesContentProps {
  purgeCache: () => void;
  loader: UnwrappedLoader<typeof fetchAllData>;
}

interface GalleryQuickstartProps {
  quickStarts: QuickStart[];
  purgeCache: () => void;
}

const GalleryQuickstart: React.FC<GalleryQuickstartProps> = ({
  quickStarts,
  purgeCache,
}) => {
  return (
    <Gallery
      hasGutter
      className="lr-c-global-learning-resources-page__content--gallery"
    >
      {quickStarts.map((quickStart) => {
        return (
          <GalleryItem
            key={quickStart.metadata.name}
            className="lr-c-global-learning-resources-page__content--gallery-card-wrapper"
          >
            <GlobalLearningResourcesQuickstartItem
              quickStart={quickStart}
              purgeCache={purgeCache}
              key={quickStart.metadata.name}
            />
          </GalleryItem>
        );
      })}
    </Gallery>
  );
};

const GalleryBookmarkedQuickstart: React.FC<GalleryQuickstartProps> = ({
  quickStarts,
  purgeCache,
}) => {
  const [, setSearchParams] = useSearchParams();

  const bookmarkedItemsCount = quickStarts.reduce(
    (acc, quickStart) => (quickStart.metadata.favorite ? acc + 1 : acc),
    0
  );
  if (bookmarkedItemsCount === 0) {
    return (
      <Bullseye>
        <EmptyState className="lr-c-global-learning-resources-page__content--empty">
          <EmptyStateHeader
            titleText="No resources bookmarked"
            headingLevel="h4"
            icon={<EmptyStateIcon icon={CubesIcon} />}
          />
          <EmptyStateBody>
            You don&apos;t have any bookmarked learning resources. Click the
            icon in cards on the &apos;All learning resources&apos; tab to
            bookmark a resource.
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button
                variant="link"
                onClick={() => setSearchParams({ tab: TabsEnum.All })}
              >
                Go to the &apos;All learning resources&apos; tab
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </Bullseye>
    );
  }
  const bookmarkedQuickStarts = quickStarts.filter(
    (item) => item.metadata.favorite
  );
  return (
    <Gallery
      hasGutter
      className="lr-c-global-learning-resources-page__content--gallery"
    >
      {bookmarkedQuickStarts.map((quickStart) => {
        if (quickStart.metadata.favorite) {
          return (
            <div
              key={quickStart.metadata.name}
              className="lr-c-global-learning-resources-page__content--gallery-card-wrapper"
            >
              <GlobalLearningResourcesQuickstartItem
                quickStart={quickStart}
                purgeCache={purgeCache}
                key={quickStart.metadata.name}
              />
            </div>
          );
        }
      })}
    </Gallery>
  );
};

const GlobalLearningResourcesContent: React.FC<
  GlobalLearningResourcesContentProps
> = ({ loader, purgeCache }) => {
  const chrome = useChrome();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({ tab: TabsEnum.All });
  }, []);

  const [, quickStarts] = loader(chrome.auth.getUser);

  return (
    <div className="pf-v5-u-p-md">
      <TabContent
        id="refTabResources"
        hidden={searchParams.get('tab') !== TabsEnum.All}
      >
        <GalleryQuickstart quickStarts={quickStarts} purgeCache={purgeCache} />
      </TabContent>
      <TabContent
        id="refTabBookmarks"
        hidden={searchParams.get('tab') !== TabsEnum.Bookmarks}
      >
        <GalleryBookmarkedQuickstart
          quickStarts={quickStarts}
          purgeCache={purgeCache}
        />
      </TabContent>
    </div>
  );
};

export default GlobalLearningResourcesContent;
