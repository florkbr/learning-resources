import React, { Suspense } from 'react';
import GlobalLearningResourcesHeader from './GlobalLearningResourcesHeader';
import GlobalLearningResourcesTabs from './GlobalLearningResourcesTabs';
import GlobalLearningResourcesFilters from './GlobalLearningResourcesFilters';
import GlobalLearningResourcesContent from './GlobalLearningResourcesContent';
import './GlobalLearningResourcesPage.scss';
import useSuspenseLoader from '@redhat-cloud-services/frontend-components-utilities/useSuspenseLoader/useSuspenseLoader';
import fetchQuickstarts from '../../utils/fetchQuickstarts';
import { Spinner } from '@patternfly/react-core';

export const GlobalLearningResourcesPage = () => {
  const { loader, purgeCache } = useSuspenseLoader(fetchQuickstarts);

  return (
    <div className="lr-c-global-learning-resources-page">
      <div className="lr-c-global-learning-resources-page__top-container">
        <GlobalLearningResourcesHeader />
        <Suspense fallback={<GlobalLearningResourcesTabs />}>
          <GlobalLearningResourcesTabs loader={loader} />
        </Suspense>
      </div>
      <div className="lr-c-global-learning-resources-page__main">
        <GlobalLearningResourcesFilters />
        <Suspense
          fallback={
            <Spinner
              size="xl"
              aria-label="Learning resources are being loaded."
            />
          }
        >
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
