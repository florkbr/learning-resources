import React, { Suspense, useState } from 'react';
import GlobalLearningResourcesHeader from './GlobalLearningResourcesHeader';
import GlobalLearningResourcesTabs from './GlobalLearningResourcesTabs';
import GlobalLearningResourcesFilters from './GlobalLearningResourcesFilters';
import GlobalLearningResourcesContent from './GlobalLearningResourcesContent';
import './GlobalLearningResourcesPage.scss';
import useSuspenseLoader from '@redhat-cloud-services/frontend-components-utilities/useSuspenseLoader/useSuspenseLoader';
import fetchAllData, { loaderOptionsDefault } from '../../utils/fetchAllData';
import { FetchQuickstartsOptions } from '../../utils/fetchQuickstarts';
import GlobalLearningResourcesFiltersFallback from './GlobalLearningResourcesFiltersFallback';
import GlobalLearningResourcesContentFallback from './GlobalLearningResourcesContentFallback';

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
        <Suspense fallback={<GlobalLearningResourcesFiltersFallback />}>
          <GlobalLearningResourcesFilters
            loader={loader}
            loaderOptions={loaderOptions}
            setLoaderOptions={setLoaderOptions}
          />
        </Suspense>
        <Suspense fallback={<GlobalLearningResourcesContentFallback />}>
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
