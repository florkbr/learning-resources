import React, { useEffect, useMemo } from 'react';
import { GalleryItem, TabContent } from '@patternfly/react-core';
import './GlobalLearningResourcesContent.scss';
import { Gallery } from '@patternfly/react-core';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import GlobalLearningResourcesQuickstartItem from './GlobalLearningResourcesQuickstartItem';
import { useSearchParams } from 'react-router-dom';
import { UnwrappedLoader } from '@redhat-cloud-services/frontend-components-utilities/useSuspenseLoader';
import { TabsEnum } from '../../utils/TabsEnum';
import fetchAllData from '../../utils/fetchAllData';
import {
  ExtendedQuickstart,
  FetchQuickstartsOptions,
} from '../../utils/fetchQuickstarts';
import { Filter, FilterMap, ValidTags } from '../../utils/filtersInterface';
import { TagsEnum } from '../../utils/tagsEnum';
import EmptyStateComponent from './EmptyState';

interface GlobalLearningResourcesContentProps {
  loader: UnwrappedLoader<typeof fetchAllData>;
  loaderOptions: FetchQuickstartsOptions;
  purgeCache: () => void;
}

interface GalleryQuickstartProps {
  quickStarts: ExtendedQuickstart[];
  purgeCache: () => void;
  filterMap: FilterMap;
}

function isValidTagType(
  key: string,
  storage: ValidTags
): key is keyof ValidTags {
  return Object.prototype.hasOwnProperty.call(storage, key);
}

const findQuickstartFilterTags = (
  filterMap: FilterMap,
  QuickStart: ExtendedQuickstart
) => {
  const modifiedTags = QuickStart.metadata.tags.reduce<{
    [TagsEnum.ProductFamilies]: Filter[];
    [TagsEnum.UseCase]: Filter[];
  }>(
    (acc, curr) => {
      const key = curr.kind;
      if (isValidTagType(key, acc)) {
        const newEntry = filterMap[curr.kind][curr.value];
        if (newEntry) {
          acc[key].push(newEntry);
        }
      }
      return acc;
    },
    {
      [TagsEnum.ProductFamilies]: [],
      [TagsEnum.UseCase]: [],
    }
  );

  return modifiedTags;
};

const GalleryQuickstart: React.FC<GalleryQuickstartProps> = ({
  quickStarts,
  purgeCache,
  filterMap,
}) => {
  if (quickStarts.length === 0) {
    return <EmptyStateComponent />;
  }

  return (
    <Gallery
      hasGutter
      className="lr-c-global-learning-resources-page__content--gallery"
    >
      {quickStarts.map((quickStart) => {
        const quickStartTags = findQuickstartFilterTags(filterMap, quickStart);
        return (
          <GalleryItem
            key={quickStart.metadata.name}
            className="lr-c-global-learning-resources-page__content--gallery-card-wrapper"
          >
            <GlobalLearningResourcesQuickstartItem
              quickStart={quickStart}
              purgeCache={purgeCache}
              quickStartTags={quickStartTags}
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
  filterMap,
}) => {
  const bookmarkedItemsCount = quickStarts.reduce(
    (acc, quickStart) => (quickStart.metadata.favorite ? acc + 1 : acc),
    0
  );
  if (bookmarkedItemsCount === 0) {
    return <EmptyStateComponent />;
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
          const quickStartTags = findQuickstartFilterTags(
            filterMap,
            quickStart
          );
          return (
            <div
              key={quickStart.metadata.name}
              className="lr-c-global-learning-resources-page__content--gallery-card-wrapper"
            >
              <GlobalLearningResourcesQuickstartItem
                quickStart={quickStart}
                purgeCache={purgeCache}
                quickStartTags={quickStartTags}
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
> = ({ loader, loaderOptions, purgeCache }) => {
  const chrome = useChrome();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({ tab: TabsEnum.All });
  }, []);

  const [filters, quickStarts] = loader(chrome.auth.getUser, loaderOptions);

  const filterMap = useMemo(() => {
    const filterMap: FilterMap = {};

    filters.data.categories.forEach((category) => {
      const categoryId = category.categoryId;

      // Initialize the category object if it doesn't exist
      if (!filterMap[categoryId]) {
        filterMap[categoryId] = {};
      }

      category.categoryData.forEach((dataGroup) => {
        dataGroup.data.forEach((filter) => {
          filterMap[categoryId][filter.id] = {
            id: filter.id,
            cardLabel: filter.cardLabel,
            filterLabel: filter.filterLabel,
            ...(filter.icon && { icon: filter.icon }), // Only include the icon if it exists
          };
        });
      });
    });
    return filterMap;
  }, [filters]);

  return (
    <div className="pf-v5-u-p-md">
      <TabContent
        id="refTabResources"
        hidden={searchParams.get('tab') !== TabsEnum.All}
      >
        <GalleryQuickstart
          quickStarts={quickStarts}
          filterMap={filterMap}
          purgeCache={purgeCache}
        />
      </TabContent>
      <TabContent
        id="refTabBookmarks"
        hidden={searchParams.get('tab') !== TabsEnum.Bookmarks}
      >
        <GalleryBookmarkedQuickstart
          quickStarts={quickStarts}
          purgeCache={purgeCache}
          filterMap={filterMap}
        />
      </TabContent>
    </div>
  );
};

export default GlobalLearningResourcesContent;
