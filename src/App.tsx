import React, { useEffect, useState } from 'react';

import './App.scss';
import { QuickStart } from '@patternfly/quickstarts';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { Main } from '@redhat-cloud-services/frontend-components/Main';

const App = () => {
  const chrome = useChrome();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { quickStarts } = chrome;
  const { Catalog } = quickStarts;

  useEffect(() => {
    fetch(`/api/quickstarts/v1/quickstarts?bundle=settings`)
      .then<{ data: { content: QuickStart }[] }>((response) => response.json())
      .then((response) =>
        quickStarts.set(
          'settings',
          response.data.map((i) => i.content)
        )
      )
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <Main>
      <Catalog />
      <p> This is page header text </p>
    </Main>
  );
};

export default App;
