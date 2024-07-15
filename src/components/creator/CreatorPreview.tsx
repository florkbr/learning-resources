import {
  AllQuickStartStates,
  QuickStart,
  QuickStartContext,
  QuickStartDrawer,
  QuickStartStatus,
  useValuesForQuickStartContext,
} from '@patternfly/quickstarts';
import { Title } from '@patternfly/react-core';
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

  const quickstartValues = useValuesForQuickStartContext({
    allQuickStarts: [quickStart],
    activeQuickStartID:
      kindMeta?.hasTasks &&
      (currentStage.type === 'panel-overview' || currentStage.type === 'task')
        ? quickStart.metadata.name
        : '',
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
    <QuickStartContext.Provider value={quickstartValues}>
      <QuickStartDrawer quickStarts={allQuickStarts}>
        <section>
          <Title headingLevel="h2" size="xl" className="pf-v5-u-mb-md">
            Live card preview
          </Title>

          <div className="rc-tile-preview-wrapper">
            <WrappedQuickStartTile
              quickStart={quickStart}
              bookmarks={null}
              isActive={false}
              status={QuickStartStatus.NOT_STARTED}
            />
          </div>
        </section>
      </QuickStartDrawer>
    </QuickStartContext.Provider>
  );
};

export default CreatorPreview;
