import {
  AllQuickStartStates,
  QuickStart,
  QuickStartTile,
  getQuickStartStatus,
} from '@patternfly/quickstarts';
import {
  Badge,
  ExpandableSection,
  Gallery,
  GalleryItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import React, { PropsWithChildren, useState } from 'react';

import './CatalogSection.scss';
import classNames from 'classnames';

const CatalogSection = ({
  sectionTitle,
  sectionDescription,
  sectionCount,
  sectionQuickStarts,
  activeQuickStartID,
  allQuickStartStates,
}: PropsWithChildren<{
  sectionTitle: React.ReactNode;
  sectionDescription: React.ReactNode;
  sectionCount: number;
  sectionQuickStarts: QuickStart[];
  activeQuickStartID?: string;
  allQuickStartStates?: AllQuickStartStates;
}>) => {
  const [isExpanded, setIsExpanded] = useState(!!sectionCount);
  return (
    <ExpandableSection
      disabled={sectionCount === 0}
      isExpanded={sectionCount === 0 ? false : isExpanded}
      isIndented
      onToggle={() => setIsExpanded((prev) => !prev)}
      className={classNames('lr-c-catalog-section', {
        disabled: sectionCount === 0,
      })}
      tabIndex={sectionCount === 0 ? -1 : undefined}
      aria-disabled={sectionCount === 0}
      toggleContent={
        <Title headingLevel="h3" size="lg">
          {sectionTitle}
          <Badge isRead={!sectionCount} className="pf-u-ml-sm">
            {sectionCount}
          </Badge>
        </Title>
      }
    >
      <TextContent className="pf-u-mb-md">
        <Text>{sectionDescription}</Text>
      </TextContent>
      <Gallery hasGutter>
        {sectionQuickStarts.map((quickStart) => (
          <GalleryItem
            className="pfext-quick-start-catalog__gallery-item"
            key={quickStart.metadata.name}
          >
            <QuickStartTile
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
    </ExpandableSection>
  );
};

export default CatalogSection;
