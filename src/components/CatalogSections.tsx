import { QuickStartCatalogSection } from '@patternfly/quickstarts';
import { Gallery } from '@patternfly/react-core';
import React, { PropsWithChildren } from 'react';

const CatalogSections = ({ children }: PropsWithChildren<{}>) => {
  <QuickStartCatalogSection>
    <Gallery className="pfext-quick-start-catalog__gallery" hasGutter>
      {children}
    </Gallery>
  </QuickStartCatalogSection>;
};

export default CatalogSections;
