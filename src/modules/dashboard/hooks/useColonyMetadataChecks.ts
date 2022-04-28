import findLastIndex from 'lodash/findLastIndex';
import { useState } from 'react';

import {
  useSubgraphColonyMetadataQuery,
  Colony,
  ColonyAction,
} from '~data/index';
import { ipfsDataFetcher } from '~modules/core/fetchers';
import { ColonyAndExtensionsEvents } from '~types/colonyActions';
import {
  getSpecificActionValuesCheck,
  sortMetadataHistory,
  parseColonyMetadata,
} from '~utils/colonyActions';
import { useDataFetcher } from '~utils/hooks';

/*
 * Determine if the current medata is different from the previous one,
 * and in what way
 */
export const useColonyMetadataChecks = (
  eventName: string,
  colony: Colony,
  transactionHash: string,
  actionData: Partial<ColonyAction>,
) => {
  let metadataJSON: string | null = null;
  const [metadataIpfsHash, setMetadataIpfsHash] = useState<string>('');

  const colonyMetadataHistory = useSubgraphColonyMetadataQuery({
    variables: {
      address: colony.colonyAddress.toLowerCase(),
    },
  });

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: ipfsMetadata } = useDataFetcher(
      ipfsDataFetcher,
      [metadataIpfsHash as string],
      [metadataIpfsHash],
    );
    metadataJSON = ipfsMetadata;
  } catch (error) {
    // silent error
  }

  if (
    eventName === ColonyAndExtensionsEvents.ColonyMetadata &&
    !!colonyMetadataHistory?.data?.colony
  ) {
    const {
      data: {
        colony: { metadataHistory },
      },
    } = colonyMetadataHistory;
    const sortedMetadataHistory = sortMetadataHistory(metadataHistory);
    const currentMetadataIndex = findLastIndex(
      sortedMetadataHistory,
      ({ transaction: { id: hash } }) => hash === transactionHash,
    );
    /*
     * We have a previous metadata entry
     */
    if (currentMetadataIndex > 0) {
      const prevMetadata = sortedMetadataHistory[currentMetadataIndex - 1];
      if (prevMetadata) {
        setMetadataIpfsHash(prevMetadata.metadata);
        if (metadataJSON) {
          const prevColonyMetadata = parseColonyMetadata(metadataJSON);
          /*
           * If we have a metadata json, parse into the expected values and then
           * compare them agains the ones from the current action
           *
           * This should be the default case for a colony with metadata history
           */
          return getSpecificActionValuesCheck(
            eventName as ColonyAndExtensionsEvents,
            actionData,
            prevColonyMetadata,
          );
        }
      }
    }
    /*
     * We don't have a previous metadata entry, so fall back to the current
     * action's values if we can
     */
    if (actionData) {
      const {
        colonyDisplayName,
        colonyAvatarHash,
        colonyTokens,
        verifiedAddresses,
      } = actionData;
      return {
        nameChanged: !!colonyDisplayName,
        logoChanged: !!colonyAvatarHash,
        tokensChanged: !!colonyTokens?.length,
        verifiedAddresses: !!verifiedAddresses?.length,
      };
    }
  }
  /*
   * Default fallback, just use the current colony's values
   */
  const {
    displayName: colonyDisplayName,
    avatarHash,
    tokenAddresses,
    whitelistedAddresses,
  } = colony;
  return {
    nameChanged: !!colonyDisplayName,
    logoChanged: !!avatarHash,
    tokensChanged: !!tokenAddresses?.length,
    verifiedAddresses: !!whitelistedAddresses?.length,
  };
};
