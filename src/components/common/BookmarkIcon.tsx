import React from 'react';
import { BookmarkIcon, OutlinedBookmarkIcon } from '@patternfly/react-icons';
import { Icon } from '@patternfly/react-core';
import './BookmarkIcon.scss';

export const OutlinedBookmarkedIcon = () => (
  <Icon className="lr-c-bookmark__icon">
    <OutlinedBookmarkIcon />
  </Icon>
);

export const BookmarkedIcon = () => (
  <Icon className="lr-c-bookmark__icon">
    <BookmarkIcon />
  </Icon>
);
