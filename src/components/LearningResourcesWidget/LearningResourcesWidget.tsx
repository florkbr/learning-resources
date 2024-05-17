import React from 'react';
import {
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core/dist/dynamic/components/Text';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { Link } from 'react-router-dom';
import { Gallery } from '@patternfly/react-core/dist/dynamic/layouts/Gallery';
import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import LearningResourcesEmptyState from './EmptyState';
import useQuickStarts from '../../hooks/useQuickStarts';
import {
  Bullseye,
  Flex,
  FlexItem,
  Icon,
  Spinner,
} from '@patternfly/react-core';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

import './LearningResourcesWidget.scss';

export const API_BASE = '/api/quickstarts/v1';
export const QUICKSTARTS = '/quickstarts';
export const FAVORITES = '/favorites';

export type FavoriteQuickStart = {
  favorite: boolean;
  quickstartName: string;
};

const LinkWrapper = ({
  pathname,
  title,
}: {
  pathname: string;
  title: string;
}) => {
  const { updateDocumentTitle } = useChrome();
  return (
    <Link onClick={() => updateDocumentTitle(title)} to={pathname}>
      {title}
    </Link>
  );
};

const LearningResourcesWidget: React.FunctionComponent = () => {
  const { bookmarks, contentReady } = useQuickStarts('settings');

  const getPathName = (url: string) => {
    return new URL(url).host;
  };

  return (
    <div>
      {contentReady ? (
        bookmarks.length === 0 ? (
          <LearningResourcesEmptyState />
        ) : (
          <Gallery className="widget-learning-resources pf-v5-u-p-md" hasGutter>
            {bookmarks.map(({ spec, metadata }, index) => (
              <div key={index}>
                <TextContent>
                  {metadata.externalDocumentation ? (
                    <a href={spec.link?.href} target="_blank" rel="noreferrer">
                      {spec.displayName}
                      <Icon className="pf-v5-u-ml-sm" isInline>
                        <ExternalLinkAltIcon />
                      </Icon>
                    </a>
                  ) : (
                    <LinkWrapper
                      title={spec.displayName}
                      pathname={spec.link?.href || ''}
                    />
                  )}
                </TextContent>
                <Flex direction={{ default: 'row' }}>
                  <FlexItem className="pf-v5-u-mr-sm">
                    {spec.type && (
                      <Label color={spec.type.color}>{spec.type.text}</Label>
                    )}
                  </FlexItem>
                  <FlexItem>
                    <TextContent>
                      <Text component={TextVariants.small}>
                        {spec.link?.href ? getPathName(spec.link?.href) : ''}
                      </Text>
                    </TextContent>
                  </FlexItem>
                </Flex>
              </div>
            ))}
          </Gallery>
        )
      ) : (
        <Bullseye>
          <Spinner />
        </Bullseye>
      )}
    </div>
  );
};

export default LearningResourcesWidget;
