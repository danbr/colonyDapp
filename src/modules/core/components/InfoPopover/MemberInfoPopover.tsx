import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Badge from '~core/Badge';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import {
  AnyUser,
  useUserBadgesQuery,
  useUserReputationQuery,
  useColonyNativeTokenQuery,
} from '~data/index';
import { Address } from '~types/index';

import UserInfo from './UserInfo';

import styles from './InfoPopover.css';

interface Props {
  colonyAddress: Address;
  domainId?: number;
  user: AnyUser;
}

const MSG = defineMessages({
  achievementsHeading: {
    id: 'InfoPopover.MemberInfoPopover.achievementsHeading',
    defaultMessage: 'Achievements',
  },
  achievementTitleText: {
    id: 'InfoPopover.MemberInfoPopover.achievementTitleText',
    defaultMessage: '{title} achievement earned in {programTitle}',
  },
  headingReputation: {
    id: 'InfoPopover.MemberInfoPopover.headingReputation',
    defaultMessage: 'Reputation',
  },
  descriptionReputation: {
    id: 'InfoPopover.MemberInfoPopover.descriptionReputation',
    defaultMessage: 'earned for tasks paid in native tokens',
  },
  errorReputation: {
    id: 'InfoPopover.MemberInfoPopover.errorReputation',
    defaultMessage: 'We had a problem loading the data',
  },
});

const displayName = 'InfoPopover.MemberInfoPopover';

const MemberInfoPopover = ({ colonyAddress, domainId, user }: Props) => {
  const { formatMessage } = useIntl();
  const {
    profile: { walletAddress },
  } = user;

  const {
    data: userReputationData,
    loading: loadingUserReputation,
    error: errorReputation,
  } = useUserReputationQuery({
    variables: { address: walletAddress, colonyAddress, domainId },
  });

  const {
    data: nativeTokenData,
    loading: loadingNativeToken,
  } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });

  const { data } = useUserBadgesQuery({
    variables: { address: walletAddress, colonyAddress },
  });

  const completedLevels = data ? data.user.completedLevels : [];

  return (
    <div className={styles.main}>
      <div className={styles.section}>
        <UserInfo user={user} />
      </div>
      <div className={styles.section}>
        <div className={styles.reputation}>
          <div className={styles.reputationHeading}>
            <Heading
              appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
              text={MSG.headingReputation}
            />
          </div>
          {userReputationData && nativeTokenData && (
            <Numeral
              appearance={{ theme: 'blue', weight: 'medium' }}
              value={userReputationData.userReputation}
              unit={DEFAULT_TOKEN_DECIMALS}
            />
          )}
        </div>
        {(loadingUserReputation || loadingNativeToken) && <SpinnerLoader />}
        {userReputationData && (
          <>
            <FormattedMessage tagName="b" {...MSG.descriptionReputation} />
          </>
        )}
        {errorReputation && (
          <FormattedMessage tagName="i" {...MSG.errorReputation} />
        )}
      </div>
      {completedLevels.length > 0 && (
        <div className={styles.section}>
          <Heading
            appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
            text={MSG.achievementsHeading}
          />
          <div className={styles.badges}>
            {completedLevels.map(
              ({ achievement, id, title, program: { title: programTitle } }) =>
                achievement &&
                title && (
                  <Badge
                    key={id}
                    size="xs"
                    name={achievement}
                    title={formatMessage(MSG.achievementTitleText, {
                      title,
                      programTitle,
                    })}
                  />
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

MemberInfoPopover.displayName = displayName;

export default MemberInfoPopover;
