import { ChromeAPI } from '@redhat-cloud-services/types';
import { API_BASE, FAVORITES, FavoriteQuickStart } from './toggleFavorite';
import { QUICKSTARTS } from '../hooks/useQuickStarts';
import axios from 'axios';
import { QuickStart } from '@patternfly/quickstarts';

async function fetchQuickstarts(
  getUser: ChromeAPI['auth']['getUser'],
  bundle?: string
) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  const account = user.identity.internal?.account_id;

  const quickstartsPath = `${API_BASE}/${QUICKSTARTS}`;

  const contentPromise = axios
    .get<{ data: { content: QuickStart }[] }>(quickstartsPath, {
      params: { account, bundle },
    })
    .then(({ data }) => {
      return data.data.map(({ content }) => content);
    });

  const favoritesPromise = account
    ? axios
        .get<{ data: FavoriteQuickStart[] }>(`${API_BASE}/${FAVORITES}`, {
          params: { account },
        })
        .then(({ data }) => data.data)
    : Promise.resolve<FavoriteQuickStart[]>([]);

  const [content, favorites] = await Promise.all([
    contentPromise,
    favoritesPromise,
  ]);

  const hashMap: { [key: string]: boolean } = {};

  favorites.forEach((item) => {
    hashMap[item.quickstartName] = item.favorite;
  });

  return content.map((item) => {
    const name = item.metadata.name;
    return {
      ...item,
      metadata: {
        ...item.metadata,
        favorite: !!hashMap[name],
      },
    };
  });
}

export default fetchQuickstarts;
