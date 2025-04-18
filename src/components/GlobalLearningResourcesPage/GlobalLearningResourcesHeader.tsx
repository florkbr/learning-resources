import React from 'react';
import './GlobalLearningResourcesHeader.scss';
import {
  Divider,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

export const GlobalLearningResourcesHeader = () => {
  return (
    <div className="lr-c-global-learning-resources-page__header">
      <img
        className="pf-v5-u-ml-lg pf-v5-u-mr-lg lr-c-global-learning-resources-page__header--image"
        width="48px"
        height="48px"
        src="/apps/frontend-assets/learning-resources/LearningResources.svg"
        alt="Learning resources icon"
      />
      <Divider
        className="pf-v5-u-pt-md pf-v5-u-pb-md"
        orientation={{
          default: 'vertical',
        }}
        inset={{
          default: 'insetSm',
        }}
      />
      <TextContent>
        <Stack className="pf-v5-u-m-lg">
          <StackItem>
            <Text component={TextVariants.h1}>All learning resources</Text>
          </StackItem>
          <StackItem>
            <Text component={TextVariants.p}>
              See learning resources for services and features across the Hybrid
              Cloud Console. Find additional resources on{' '}
              <Text
                component={TextVariants.a}
                href="https://developers.redhat.com/learn"
                target="_blank"
                rel="noopener noreferrer"
              >
                developers.redhat.com
              </Text>
              ,{' '}
              <Text
                component={TextVariants.a}
                href="https://cloud.redhat.com/learn"
                target="_blank"
                rel="noopener noreferrer"
              >
                cloud.redhat.com
              </Text>
              , and on{' '}
              <Text
                component={TextVariants.a}
                href="https://www.redhat.com/en/resources"
                target="_blank"
                rel="noopener noreferrer"
              >
                redhat.com
              </Text>
              .
            </Text>
          </StackItem>
        </Stack>
      </TextContent>
    </div>
  );
};

export default GlobalLearningResourcesHeader;
