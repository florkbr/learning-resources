import React, { Suspense } from 'react';
import GlobalLearningResourcesHeader from './GlobalLearningResourcesHeader';
import GlobalLearningResourcesTabs from './GlobalLearningResourcesTabs';
import GlobalLearningResourcesFilters from './GlobalLearningResourcesFilters';
import GlobalLearningResourcesContent from './GlobalLearningResourcesContent';
import './GlobalLearningResourcesPage.scss';
import useSuspenseLoader from '@redhat-cloud-services/frontend-components-utilities/useSuspenseLoader/useSuspenseLoader';
import { Spinner } from '@patternfly/react-core';
import fetchAllData from '../../utils/fetchAllData';

export const GlobalLearningResourcesPage = () => {
  const { loader, purgeCache } = useSuspenseLoader(fetchAllData);

  return (
    <div className="lr-c-global-learning-resources-page">
      <div className="lr-c-global-learning-resources-page__top-container">
        <GlobalLearningResourcesHeader />
        <Suspense fallback={<GlobalLearningResourcesTabs />}>
          <GlobalLearningResourcesTabs loader={loader} />
        </Suspense>
      </div>
      <div className="lr-c-global-learning-resources-page__main">
        <Suspense
          fallback={
            <Spinner
              size="xl"
              aria-label="Learning resources are being loaded."
            />
          }
        >
          <GlobalLearningResourcesFilters loader={loader} />
          <GlobalLearningResourcesContent
            loader={loader}
            purgeCache={purgeCache}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default GlobalLearningResourcesPage;
