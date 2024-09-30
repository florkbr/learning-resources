import React, { Suspense, useState } from 'react';
import GlobalLearningResourcesHeader from './GlobalLearningResourcesHeader';
import GlobalLearningResourcesTabs from './GlobalLearningResourcesTabs';
import GlobalLearningResourcesFilters from './GlobalLearningResourcesFilters';
import GlobalLearningResourcesContent from './GlobalLearningResourcesContent';
import './GlobalLearningResourcesPage.scss';
import useSuspenseLoader from '@redhat-cloud-services/frontend-components-utilities/useSuspenseLoader/useSuspenseLoader';
import { Spinner } from '@patternfly/react-core';
import fetchAllData, { loaderOptionsDefault } from '../../utils/fetchAllData';
import { FetchQuickstartsOptions } from '../../utils/fetchQuickstarts';

export const GlobalLearningResourcesPage = () => {
  const { loader, purgeCache } = useSuspenseLoader(fetchAllData);
  const [loaderOptions, setLoaderOptions] =
    useState<FetchQuickstartsOptions>(loaderOptionsDefault);

  return (
    <div className="lr-c-global-learning-resources-page">
      <div className="lr-c-global-learning-resources-page__top-container">
        <GlobalLearningResourcesHeader />
        <Suspense fallback={<GlobalLearningResourcesTabs />}>
          <GlobalLearningResourcesTabs
            loader={loader}
            loaderOptions={loaderOptions}
          />
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
          <GlobalLearningResourcesFilters
            loader={loader}
            loaderOptions={loaderOptions}
            setLoaderOptions={setLoaderOptions}
          />
        </Suspense>
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
            loaderOptions={loaderOptions}
            purgeCache={purgeCache}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default GlobalLearningResourcesPage;
