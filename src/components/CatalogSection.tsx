import {
  AllQuickStartStates,
  QuickStart,
  QuickStartTile,
  getQuickStartStatus,
} from '@patternfly/quickstarts';
import {
  Badge,
  Button,
  ExpandableSection,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Icon,
  Split,
  SplitItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import React, { PropsWithChildren, SyntheticEvent, useState } from 'react';
import {
  AngleRightIcon,
  BookmarkIcon,
  OutlinedBookmarkIcon,
} from '@patternfly/react-icons';
import { useFlag } from '@unleash/proxy-client-react';

import './CatalogSection.scss';

const OutlinedBookmarkedIcon = () => (
  <Icon className="lr-c-bookmark__icon">
    <OutlinedBookmarkIcon />
  </Icon>
);

const BookmarkedIcon = () => (
  <Icon className="lr-c-bookmark__icon">
    <BookmarkIcon />
  </Icon>
);

const CatalogWrapper: React.FC<
  PropsWithChildren<{
    sectionCount: number;
    sectionTitle: React.ReactNode;
    children: React.ReactNode;
    isExpandable?: boolean;
    rightTitle?: React.ReactNode;
  }>
> = ({
  children,
  sectionTitle,
  sectionCount,
  isExpandable = true,
  rightTitle,
}) => {
  const [isExpanded, setIsExpanded] = useState(!!sectionCount);

  if (!isExpandable) {
    return (
      <div className="lr-c-catalog-section">
        <Split>
          <SplitItem isFilled>
            <Title headingLevel="h3" size="lg">
              {sectionTitle}
              <Badge className="pf-u-ml-sm">{sectionCount}</Badge>
            </Title>
          </SplitItem>
          <SplitItem>{rightTitle}</SplitItem>
        </Split>
        {children}
      </div>
    );
  }

  return (
    <ExpandableSection
      isExpanded={isExpanded}
      isIndented
      onToggle={() => setIsExpanded((prev) => !prev)}
      className="lr-c-catalog-section"
      toggleContent={
        <Split>
          <SplitItem isFilled>
            <Title headingLevel="h3" size="lg">
              {sectionTitle}
              <Badge isRead={!sectionCount} className="pf-u-ml-sm">
                {sectionCount}
              </Badge>
            </Title>
          </SplitItem>
          <SplitItem>{rightTitle}</SplitItem>
        </Split>
      }
    >
      {children}
    </ExpandableSection>
  );
};

const CatalogSection = ({
  sectionTitle,
  sectionDescription,
  sectionCount,
  sectionQuickStarts,
  isExpandable = true,
  activeQuickStartID,
  allQuickStartStates,
  rightTitle,
  emptyBody,
  toggleFavorite,
}: PropsWithChildren<{
  sectionTitle: React.ReactNode;
  sectionCount: number;
  sectionQuickStarts: QuickStart[];
  sectionName: string;
  emptyBody?: React.ReactNode;
  rightTitle?: React.ReactNode;
  sectionDescription?: React.ReactNode;
  isExpandable?: boolean;
  activeQuickStartID?: string;
  allQuickStartStates?: AllQuickStartStates;
  toggleFavorite: (name: string, favorite: boolean) => Promise<void>;
}>) => {
  const showBookmarks = useFlag('platform.learning-resources.bookmarks');
  // Expandable section does not support disabled sections
  if (sectionCount === 0 && isExpandable) {
    return (
      <Flex alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <Button
            className="pf-c-expandable-section__toggle"
            variant="plain"
            isDisabled
            icon={<AngleRightIcon />}
          ></Button>
        </FlexItem>
        <FlexItem>
          <SplitItem isFilled>
            <Title headingLevel="h3" size="lg">
              {sectionTitle}
              <Badge isRead={!sectionCount} className="pf-u-ml-sm">
                {sectionCount}
              </Badge>
            </Title>
          </SplitItem>
          <SplitItem>{rightTitle}</SplitItem>
        </FlexItem>
      </Flex>
    );
  }

  return (
    <CatalogWrapper
      sectionCount={sectionCount}
      sectionTitle={sectionTitle}
      isExpandable={isExpandable}
      rightTitle={rightTitle}
    >
      {sectionDescription && (
        <TextContent className="pf-u-mb-md">
          <Text>{sectionDescription}</Text>
        </TextContent>
      )}
      {sectionCount ? (
        <Gallery hasGutter>
          {sectionQuickStarts.map((quickStart) => (
            <GalleryItem
              className="lr-c-quickstart_tile"
              key={quickStart.metadata.name}
            >
              <QuickStartTile
                action={{
                  'aria-label': quickStart.metadata.favorite
                    ? `Remove quickstart ${quickStart.spec.displayName} from bookmarks.`
                    : `Bookmark quickstart ${quickStart.spec.displayName}.`,
                  icon: showBookmarks
                    ? quickStart.metadata.favorite
                      ? BookmarkedIcon
                      : OutlinedBookmarkedIcon
                    : undefined,
                  onClick: (e: SyntheticEvent<Element, Event>): void => {
                    console.log({ showBookmarks });
                    if (showBookmarks) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(
                        quickStart.metadata.name,
                        !quickStart.metadata.favorite
                      );
                    }
                  },
                }}
                quickStart={{
                  ...quickStart,
                  spec: {
                    ...quickStart.spec,
                    // remove any lingering icons
                    icon: null,
                  },
                }}
                isActive={quickStart.metadata.name === activeQuickStartID}
                status={getQuickStartStatus(
                  allQuickStartStates || {},
                  quickStart.metadata.name
                )}
              />
            </GalleryItem>
          ))}
        </Gallery>
      ) : (
        emptyBody
      )}
    </CatalogWrapper>
  );
};

export default CatalogSection;
