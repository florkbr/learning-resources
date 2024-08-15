import React, { SyntheticEvent, useState } from 'react';
import { QuickStart } from '@patternfly/quickstarts';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { API_BASE, FAVORITES } from '../../hooks/useQuickStarts';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import axios from 'axios';
import './GlobalLearningResourcesQuickstartItem.scss';
import { BookmarkedIcon, OutlinedBookmarkedIcon } from '../common/BookmarkIcon';

interface GlobalLearningResourcesQuickstartItemProps {
  quickStart: QuickStart;
  purgeCache: () => void;
}

const GlobalLearningResourcesQuickstartItem: React.FC<
  GlobalLearningResourcesQuickstartItemProps
> = ({ quickStart, purgeCache }) => {
  const chrome = useChrome();
  const [isBookmarked, setIsBookmarked] = useState(
    quickStart.metadata.favorite
  );
  const quickStartURL = new URL(
    quickStart.spec.link?.href ?? 'https://access.redhat.com/'
  );
  const labelColor = quickStart.spec.type?.color;

  const handleBookmark = async (e: SyntheticEvent<Element, Event>) => {
    const user = await chrome.auth.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }
    const account = user.identity.internal?.account_id;
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsBookmarked((flag: boolean) => !flag);
      await axios.post(`${API_BASE}/${FAVORITES}?account=${account}`, {
        quickstartName: quickStart.metadata.name,
        favorite: !isBookmarked,
      });
      purgeCache();
    } catch (error) {
      setIsBookmarked(quickStart.metadata.favorite);
    }
  };

  return (
    <Card className="lr-c-global-learning-resources-quickstart__card pf-v5-u-p-sm">
      <TextContent className="lr-c-global-learning-resources-quickstart__card--content">
        <CardTitle
          component="div"
          className="lr-c-global-learning-resources-quickstart__card--title"
        >
          <div className="lr-c-global-learning-resources-quickstart__card--title-container">
            <Text component={TextVariants.h3}>
              {quickStart.spec.displayName}
            </Text>
          </div>
          <Button
            onClick={handleBookmark}
            variant="plain"
            aria-label={
              quickStart.metadata.favorite
                ? 'Unbookmark learning resource'
                : 'Bookmark learning resource'
            }
          >
            {isBookmarked ? <BookmarkedIcon /> : <OutlinedBookmarkedIcon />}
          </Button>
        </CardTitle>
        <CardBody component="div">
          <div className="lr-c-global-learning-resources-quickstart__card--body pf-v5-u-mb-md">
            <Label isCompact color={labelColor}>
              {quickStart.spec.type?.text}
            </Label>
            <Text component={TextVariants.small}>{quickStartURL.hostname}</Text>
          </div>
          <Text component={TextVariants.p}>{quickStart.spec.description}</Text>
        </CardBody>
        <CardFooter className="lr-c-global-learning-resources-quickstart__card--footer">
          <Text component={TextVariants.small}>Footer</Text>
        </CardFooter>
      </TextContent>
    </Card>
  );
};

export default GlobalLearningResourcesQuickstartItem;
