import {
  AllQuickStartStates,
  QuickStart,
  QuickStartContext,
  QuickStartDrawer,
  QuickStartStatus,
  useValuesForQuickStartContext,
} from '@patternfly/quickstarts';
import { Flex, FlexItem, Title } from '@patternfly/react-core';
import WrappedQuickStartTile from '../WrappedQuickStartTile';
import React, { useContext, useMemo, useState } from 'react';
import { ItemMeta } from './meta';
import './CreatorPreview.scss';
import { CreatorWizardStage } from './schema';

const CreatorPreview = ({
  kindMeta,
  quickStart,
  currentStage,
}: {
  kindMeta: ItemMeta | null;
  quickStart: QuickStart;
  currentStage: CreatorWizardStage;
}) => {
  const allQuickStarts = useMemo(() => [quickStart], [quickStart]);
  const [quickStartStates, setQuickStartStates] = useState<AllQuickStartStates>(
    {}
  );

  const [prevStage, setPrevStage] = useState<typeof currentStage | null>(
    currentStage
  );

  const parentContext = useContext(QuickStartContext);

  const showPanel =
    kindMeta?.hasTasks &&
    (currentStage.type === 'panel-overview' || currentStage.type === 'task');

  const quickstartValues = useValuesForQuickStartContext({
    allQuickStarts: [quickStart],
    activeQuickStartID: showPanel ? quickStart.metadata.name : '',
    setActiveQuickStartID: () => {},
    allQuickStartStates: quickStartStates,
    setAllQuickStartStates: (states) => setQuickStartStates(states),
    useQueryParams: false,
    footer: parentContext.footer,
    focusOnQuickStart: false,
  });

  if (quickstartValues.allQuickStarts?.[0] !== quickStart) {
    quickstartValues.setAllQuickStarts?.([quickStart]);
  }

  if (prevStage !== currentStage) {
    setPrevStage(currentStage);

    if (currentStage.type === 'panel-overview') {
      quickstartValues.restartQuickStart?.(
        quickStart.metadata.name,
        quickStart.spec.tasks?.length ?? 0
      );
    } else if (currentStage.type === 'task') {
      quickstartValues.setQuickStartTaskNumber?.(
        quickStart.metadata.name,
        currentStage.index
      );
    }
  }

  return (
    <Flex
      direction={{ default: 'column' }}
      gap={{ default: 'gapNone' }}
      className="pf-v5-u-h-100"
    >
      <FlexItem>
        <Title headingLevel="h2" size="xl" className="pf-v5-u-mb-md">
          Live {showPanel ? kindMeta.displayName : 'card'} preview
        </Title>
      </FlexItem>

      <FlexItem grow={{ default: 'grow' }}>
        <QuickStartContext.Provider value={quickstartValues}>
          <QuickStartDrawer quickStarts={allQuickStarts}>
            <section>
              {!showPanel ? (
                <div className="rc-tile-preview-wrapper">
                  <WrappedQuickStartTile
                    quickStart={quickStart}
                    bookmarks={null}
                    isActive={false}
                    status={QuickStartStatus.NOT_STARTED}
                  />
                </div>
              ) : null}
            </section>
          </QuickStartDrawer>
        </QuickStartContext.Provider>
      </FlexItem>
    </Flex>
  );
};

export default CreatorPreview;
