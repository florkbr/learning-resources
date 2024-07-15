import React, { useMemo, useState } from 'react';
import YAML from 'yaml';
import {
  Grid,
  GridItem,
  PageGroup,
  PageSection,
  Title,
} from '@patternfly/react-core';
import { QuickStart, QuickStartSpec } from '@patternfly/quickstarts';
import CreatorWizard, { EMPTY_TASK } from './components/creator/CreatorWizard';
import { ItemKind, metaForKind } from './components/creator/meta';
import CreatorPreview from './components/creator/CreatorPreview';
import './Creator.scss';

export type CreatorErrors = {
  taskErrors: Map<number, string>;
};

const BASE_METADATA = {
  name: 'test-quickstart',
};

function makeDemoQuickStart(
  kind: ItemKind | null,
  baseQuickStart: QuickStart
): QuickStart {
  const kindMeta = kind !== null ? metaForKind(kind) : null;

  return {
    ...baseQuickStart,
    metadata: {
      ...baseQuickStart.metadata,
      name: 'test-quickstart',
      ...(kindMeta?.extraMetadata ?? {}),
    },
  };
}

const Creator = () => {
  const [rawKind, setRawKind] = useState<ItemKind | null>(null);

  const [rawQuickStart, setRawQuickStart] = useState<QuickStart>({
    metadata: {
      name: 'test-quickstart',
    },
    spec: {
      displayName: '',
      icon: null,
      description: '',
    },
  });

  const selectedKind =
    rawKind !== null ? { id: rawKind, meta: metaForKind(rawKind) } : null;

  const [bundles, setBundles] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState<number | null>(null);

  const updateSpec = (
    updater: (old: QuickStartSpec) => Partial<QuickStartSpec>
  ) => {
    setRawQuickStart((old) => ({
      ...old,
      spec: {
        ...old.spec,
        ...updater(old.spec),
      },
    }));
  };

  const setKind = (newKind: ItemKind | null) => {
    if (newKind !== null) {
      const meta = metaForKind(newKind);

      setRawQuickStart((old) => {
        const updates: Partial<QuickStart> = {};

        updates.spec = { ...old.spec };

        updates.spec.type = {
          text: meta.displayName,
          color: meta.tagColor,
        };

        if (
          meta.hasTasks &&
          (old.spec.tasks === undefined || old.spec.tasks.length === 0)
        ) {
          updates.spec.tasks = [EMPTY_TASK];
        }

        if (!meta.hasTasks) {
          updates.spec.tasks = undefined;
          updates.spec.introduction = undefined;
          updates.spec.prerequisites = [];
        }

        if (!meta.fields.url) updates.spec.link = undefined;
        if (!meta.fields.duration) updates.spec.durationMinutes = undefined;

        updates.metadata = { ...BASE_METADATA, ...meta.extraMetadata };

        return { ...old, ...updates };
      });
    }

    setRawKind(newKind);
  };

  const quickStart = useMemo(
    () => makeDemoQuickStart(rawKind, rawQuickStart),
    [rawKind, rawQuickStart]
  );

  const files = useMemo(() => {
    const effectiveName = quickStart.spec.displayName
      .toLowerCase()
      .replaceAll(/\s/g, '-')
      .replaceAll(/(^-+)|(-+$)/g, '');

    const adjustedQuickstart = { ...quickStart };
    adjustedQuickstart.spec = { ...adjustedQuickstart.spec };
    adjustedQuickstart.metadata = {
      ...adjustedQuickstart.metadata,
      name: effectiveName,
    };

    delete adjustedQuickstart.spec['icon'];

    return [
      {
        name: 'metadata.yaml',
        content: YAML.stringify({
          kind: 'QuickStarts',
          name: effectiveName,
          tags: bundles
            .toSorted()
            .map((bundle) => ({ kind: 'bundle', value: bundle })),
        }),
      },
      {
        name: `${effectiveName}.yaml`,
        content: YAML.stringify(adjustedQuickstart),
      },
    ];
  }, [quickStart, bundles]);

  return (
    <PageGroup>
      <PageSection variant="darker" className="rc-header">
        <Title headingLevel="h1" size="2xl">
          Add new learning resource
        </Title>

        <p>
          Add cards to the learning resources spaces within console.redhat.com.{' '}
          <a href="https://docs.google.com/presentation/d/1FiwBc_VuCxvobv80suXww0eKEs381MgR1WK6q7_DynY/edit#slide=id.g1b95fa54a9f_0_801">
            Learn more about Hybrid Cloud Console Learning Resources.
          </a>
        </p>
      </PageSection>

      <PageSection isFilled>
        <Grid hasGutter className="pf-v5-u-h-100 pf-v5-u-w-100">
          <GridItem span={12} lg={6}>
            <CreatorWizard
              onChangeKind={setKind}
              onChangeQuickStartSpec={(spec) => {
                updateSpec(() => spec);
              }}
              onChangeBundles={setBundles}
              onChangeCurrentTask={setCurrentTask}
              files={files}
            />
          </GridItem>

          <GridItem span={12} lg={6}>
            <CreatorPreview
              kindMeta={selectedKind?.meta ?? null}
              quickStart={quickStart}
              currentTask={currentTask}
            />
          </GridItem>
        </Grid>
      </PageSection>
    </PageGroup>
  );
};

export default Creator;
