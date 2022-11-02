import React, { useMemo, useRef, useCallback } from 'react';
import { bigNumberify } from 'ethers/utils';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import classnames from 'classnames';
import Decimal from 'decimal.js';

import { ROOT_DOMAIN_ID, ColonyRoles } from '@colony/colony-js';

import Numeral from '~core/Numeral';
import Heading from '~core/Heading';
import Tag, { Appearance as TagAppearance } from '~core/Tag';
import FriendlyName from '~core/FriendlyName';
import MemberReputation from '~core/MemberReputation';
import ProgressBar from '~core/ProgressBar';
import { ActionButton } from '~core/Button';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import MaskedAddress from '~core/MaskedAddress';
import ActionsPageFeed, {
  ActionsPageFeedItemWithIPFS,
  SystemMessage,
} from '~dashboard/ActionsPageFeed';

import { getFormattedTokenValue } from '~utils/tokens';
import {
  getUpdatedDecodedMotionRoles,
  MotionState,
  MotionValue,
  MOTION_TAG_MAP,
  shouldDisplayMotion,
} from '~utils/colonyMotions';
import { useFormatRolesTitle } from '~utils/hooks/useFormatRolesTitle';
import { mapPayload } from '~utils/actions';
import { useTitle } from '~utils/hooks/useTitle';
import { ColonyMotions, ColonyAndExtensionsEvents } from '~types/index';
import { ActionTypes } from '~redux/index';
import {
  useLoggedInUser,
  Colony,
  ColonyActionQuery,
  TokenInfoQuery,
  AnyUser,
  useStakeAmountsForMotionQuery,
  useVotingStateQuery,
  useMotionStatusQuery,
  OneDomain,
  useColonyHistoricRolesQuery,
  useNetworkContracts,
  SafeTransaction,
} from '~data/index';

import DetailsWidget from '../DetailsWidget';
import StakingWidgetFlow from '../StakingWidget';
import VoteWidget from '../VoteWidget';
import RevealWidget from '../RevealWidget';
import StakeRequiredBanner from '../StakeRequiredBanner';
import FinalizeMotionAndClaimWidget, {
  MSG as voteResultsMSG,
} from '../FinalizeMotionAndClaimWidget';
import VoteResults from '../FinalizeMotionAndClaimWidget/VoteResults';
import CountDownTimer from '../CountDownTimer';
import ActionPageMotionContent from '../ActionPageMotionContent';
import { unknownContractMSG } from '../DetailsWidget/DetailsWidgetSafeTransaction';

import styles from './DefaultAction.css';
import motionSpecificStyles from './DefaultMotion.css';

const MSG = defineMessages({
  or: {
    id: 'dashboard.ActionsPage.DefaultMotion.or',
    defaultMessage: `OR`,
  },
  escalate: {
    id: 'dashboard.ActionsPage.DefaultMotion.escalate',
    defaultMessage: `Escalate`,
  },
  escalateTooltip: {
    id: 'dashboard.ActionsPage.DefaultMotion.escalateTooltip',
    defaultMessage: `Motion escalation will be released in a future update`,
  },
  votingProgressBarTooltip: {
    id: 'dashboard.ActionsPage.DefaultMotion.votingProgressBarTooltip',
    defaultMessage: `Voting ends at the sooner of either time-out, or the reputation threshold being reached.`,
  },
  safeTransactionInitiated: {
    id: `dashboard.ActionsPage.DefaultMotion.safeTransactionInitiated`,
    defaultMessage: 'Safe Transaction Initiated',
  },
});

const displayName = 'dashboard.ActionsPage.DefaultMotion';

interface Props {
  colony: Colony;
  colonyAction: ColonyActionQuery['colonyAction'];
  token: TokenInfoQuery['tokenInfo'];
  transactionHash: string;
  recipient: AnyUser;
  initiator: AnyUser;
}

const DefaultMotion = ({
  colony: { domains, colonyAddress },
  colony,
  colonyAction: {
    actionType,
    colonyDisplayName,
    amount,
    motionDomain,
    actionInitiator,
    rootHash,
    domainName,
    domainColor,
    domainPurpose,
    roles,
    fromDomain,
    toDomain,
    blockNumber,
    newVersion,
    tokenAddress,
    reputationChange,
    createdAt,
    transactionsTitle,
    safeTransactions,
    safeData,
  },
  colonyAction,
  token,
  token: { decimals, symbol },
  transactionHash,
  recipient,
  initiator,
}: Props) => {
  const bottomElementRef = useRef<HTMLInputElement>(null);
  const {
    passedTag,
    failedTag,
    objectionTag,
    escalateTag,
    ...tags
  } = useMemo(() => {
    return Object.values(MOTION_TAG_MAP).reduce((acc, object) => {
      const { theme, colorSchema } = object as TagAppearance;
      acc[object.tagName] = (
        <span>
          <Tag text={object.name} appearance={{ theme, colorSchema }} />
        </span>
      );
      return acc;
    }, {} as any);
  }, []);
  const { formatMessage } = useIntl();

  const motionCreatedEvent = colonyAction.events.find(
    ({ name }) => name === ColonyAndExtensionsEvents.MotionCreated,
  );
  const { motionId } = (motionCreatedEvent?.values as unknown) as MotionValue;

  const {
    username: currentUserName,
    walletAddress,
    ethereal,
  } = useLoggedInUser();
  const userHasProfile = !!(currentUserName && !ethereal);

  const { data: motionStakeData } = useStakeAmountsForMotionQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      userAddress: walletAddress,
      motionId,
    },
  });

  const {
    data: motionStatusData,
    loading: loadingMotionStatus,
  } = useMotionStatusQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      motionId,
    },
    fetchPolicy: 'network-only',
  });

  const { data: historicColonyRoles } = useColonyHistoricRolesQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      blockNumber,
    },
  });

  const escalateTransform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      motionId,
      userAddress: walletAddress,
    })),
    [],
  );

  const updatedRoles = getUpdatedDecodedMotionRoles(
    recipient,
    fromDomain,
    (historicColonyRoles?.historicColonyRoles as unknown) as ColonyRoles,
    roles,
  );

  const { roleMessageDescriptorId, roleTitle } = useFormatRolesTitle(
    updatedRoles,
    actionType,
    true,
  );

  const requiredStake = bigNumberify(
    motionStakeData?.stakeAmountsForMotion?.requiredStake || 0,
  ).toString();
  const totalNayStake = bigNumberify(
    motionStakeData?.stakeAmountsForMotion?.totalStaked.NAY || 0,
  );
  const totalYayStake = bigNumberify(
    motionStakeData?.stakeAmountsForMotion?.totalStaked.YAY || 0,
  );
  const currentStake = totalNayStake.add(totalYayStake).toString();
  const isFullyNayStaked = totalNayStake.gte(requiredStake);

  const { data: votingStateData } = useVotingStateQuery({
    variables: { colonyAddress: colony.colonyAddress, motionId },
    fetchPolicy: 'network-only',
  });

  const threshold = bigNumberify(
    votingStateData?.votingState?.thresholdValue || 0,
  ).div(bigNumberify(10).pow(18));

  const totalVotedReputationValue = bigNumberify(
    votingStateData?.votingState?.totalVotedReputation || 0,
  ).div(bigNumberify(10).pow(18));

  const skillRepValue = bigNumberify(
    votingStateData?.votingState?.skillRep || 0,
  ).div(bigNumberify(10).pow(18));

  const currentReputationPercent = !totalVotedReputationValue.isZero()
    ? Math.round(
        totalVotedReputationValue.div(skillRepValue).mul(100).toNumber(),
      )
    : 0;
  const thresholdPercent = !skillRepValue.isZero()
    ? Math.round(threshold.mul(100).div(skillRepValue).toNumber())
    : 0;

  const domainMetadata = {
    name: domainName,
    color: domainColor,
    description: domainPurpose,
  };

  const formattedReputationChange = getFormattedTokenValue(
    new Decimal(reputationChange).abs().toString(),
    decimals,
  );

  const { feeInverse: networkFeeInverse } = useNetworkContracts();
  const feePercentage = networkFeeInverse
    ? bigNumberify(100).div(networkFeeInverse)
    : null;

  // In case it is a Payment Motion , calculate the payment the recipient gets, after network fees
  const decimalAmount = getFormattedTokenValue(
    feePercentage && actionType === ColonyMotions.PaymentMotion
      ? bigNumberify(amount).mul(bigNumberify(100).sub(feePercentage)).div(100)
      : amount,
    decimals,
  );

  const firstSafeTransaction: SafeTransaction | undefined = safeTransactions[0];

  const selectedSafe = colony.safes.find(
    (safe) =>
      safe.contractAddress === safeData?.contractAddress &&
      safe.chainId === safeData?.chainId,
  );

  const actionAndEventValues = {
    actionType,
    newVersion,
    fromDomain:
      (actionType === ColonyMotions.CreateDomainMotion && domainMetadata) ||
      (domains.find(
        ({ ethDomainId }) => ethDomainId === fromDomain,
      ) as OneDomain),
    toDomain: domains.find(
      ({ ethDomainId }) => ethDomainId === toDomain,
    ) as OneDomain,
    motionDomain: domains.find(
      ({ ethDomainId }) => ethDomainId === motionDomain,
    ) as OneDomain,
    roles: updatedRoles,
    recipient: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={recipient} autoShrinkAddress colony={colony} />
      </span>
    ),
    amount: <Numeral value={decimalAmount} />,
    token,
    tokenSymbol: <span>{symbol || '???'}</span>,
    initiator: (
      <>
        <span className={styles.titleDecoration}>
          <FriendlyName user={initiator} autoShrinkAddress />
        </span>
        <div className={motionSpecificStyles.reputation}>
          <MemberReputation
            walletAddress={actionInitiator}
            colonyAddress={colony.colonyAddress}
            rootHash={rootHash || undefined}
            domainId={motionDomain}
          />
        </div>
      </>
    ),
    colonyName: (
      <FriendlyName
        colony={{
          ...colony,
          ...(colonyDisplayName ? { displayName: colonyDisplayName } : {}),
        }}
        autoShrinkAddress
      />
    ),
    passedTag,
    failedTag,
    objectionTag,
    escalateTag,
    ...tags,
    voteResultsWidget: (
      <div className={motionSpecificStyles.voteResultsWrapper}>
        <Heading
          text={voteResultsMSG.title}
          textValues={{ actionType, transactionTitle: transactionsTitle }}
          appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
        />
        <VoteResults colony={colony} motionId={motionId} />
      </div>
    ),
    spaceBreak: <br />,

    reputationChange: formattedReputationChange,
    reputationChangeNumeral: <Numeral value={formattedReputationChange} />,
    isSmiteAction: new Decimal(reputationChange).isNegative(),
    safeName: <span className={styles.user}>@{selectedSafe?.safeName}</span>,
    safeTransactionSafe: selectedSafe,
    safeTransactionTitle:
      transactionsTitle || formatMessage(MSG.safeTransactionInitiated),
    safeTransactions,
    /*
     * The following references to firstSafeTransaction are only used in the event that there's only one safe transaction.
     * Multiple transactions has its own message.
     */
    safeTransactionAmount: (
      <>
        <Numeral value={firstSafeTransaction?.amount || ''} />
        <span> {firstSafeTransaction?.tokenData?.symbol}</span>
      </>
    ),
    safeTransactionRecipient: (
      <span className={styles.user}>
        @{firstSafeTransaction?.recipient?.profile.username}
      </span>
    ),
    safeTransactionNftToken: (
      <span className={styles.user}>
        {firstSafeTransaction?.nftData?.name ||
          firstSafeTransaction?.nftData?.tokenName}
      </span>
    ),
    safeTransactionFunctionName: firstSafeTransaction?.contractFunction,
    safeTransactionContractName:
      firstSafeTransaction?.contract?.profile.displayName ||
      formatMessage(unknownContractMSG),
    safeTransactionAddress: (
      <MaskedAddress
        address={firstSafeTransaction?.recipient?.profile.walletAddress || ''}
      />
    ),
    // id will be filterValue if an address was manually entered into the picker
    isSafeTransactionRecipientUser: !(
      firstSafeTransaction?.recipient?.id === 'filterValue'
    ),
  };

  const actionAndEventValuesForDocumentTitle = {
    actionType,
    newVersion,
    recipient:
      recipient.profile?.displayName ??
      recipient.profile?.username ??
      recipient.profile?.walletAddress,
    amount: decimalAmount,
    tokenSymbol: symbol,
    initiator:
      initiator.profile?.displayName ??
      initiator.profile?.username ??
      initiator.profile?.walletAddress,
    reputationChange: actionAndEventValues.reputationChange,
    reputationChangeNumeral: actionAndEventValues.reputationChangeNumeral,
    fromDomain: actionAndEventValues.fromDomain?.name,
    toDomain: actionAndEventValues.toDomain?.name,
    roles: roleTitle,
    safeTransactionTitle:
      transactionsTitle || formatMessage(MSG.safeTransactionInitiated),
  };

  const motionState = motionStatusData?.motionStatus;
  const motionStyles = MOTION_TAG_MAP[motionState || MotionState.Invalid];
  const isStakingPhase =
    motionState === MotionState.Staking ||
    motionState === MotionState.Staked ||
    motionState === MotionState.Objection;
  const isMotionFinished =
    motionState === MotionState.Passed ||
    motionState === MotionState.Failed ||
    motionState === MotionState.FailedNotFinalizable;

  useTitle(
    `${formatMessage(
      { id: roleMessageDescriptorId || 'action.title' },
      actionAndEventValuesForDocumentTitle,
    )} | Motion | Colony - ${colony.displayName ?? colony.colonyName ?? ``}`,
  );

  const isDecision = actionType === ColonyMotions.CreateDecisionMotion;
  const hasBanner = !shouldDisplayMotion(currentStake, requiredStake);

  return (
    <div className={styles.main}>
      <StakeRequiredBanner stakeRequired={hasBanner} isDecision={isDecision} />
      <div
        className={`${styles.upperContainer} ${
          hasBanner && styles.bannerPadding
        }`}
      >
        {motionState && (
          <p className={styles.tagWrapper} data-test="motionStatusTag">
            <Tag
              text={motionStyles.name}
              appearance={{
                theme: motionStyles.theme,
                colorSchema: motionStyles.colorSchema,
              }}
            />
          </p>
        )}
        <div
          className={classnames(styles.countdownContainer, {
            [styles.votingCountdownContainer]:
              motionState === MotionState.Voting && votingStateData,
          })}
        >
          {!loadingMotionStatus && !isMotionFinished && (
            <CountDownTimer
              colony={colony}
              state={motionState as MotionState}
              motionId={motionId}
              isFullyNayStaked={isFullyNayStaked}
            />
          )}
          {motionState === MotionState.Voting && votingStateData && (
            <div className={motionSpecificStyles.progressStateContainer}>
              <span className={motionSpecificStyles.text}>
                <FormattedMessage {...MSG.or} />
              </span>
              <div className={motionSpecificStyles.progressBarContainer}>
                <ProgressBar
                  value={currentReputationPercent}
                  threshold={thresholdPercent}
                  max={100}
                  appearance={{
                    size: 'small',
                    backgroundTheme: 'dark',
                    barTheme: 'primary',
                    borderRadius: 'small',
                  }}
                />
              </div>

              <QuestionMarkTooltip
                tooltipText={MSG.votingProgressBarTooltip}
                className={motionSpecificStyles.helpProgressBar}
                tooltipClassName={motionSpecificStyles.tooltip}
                showArrow={false}
                tooltipPopperOptions={{
                  placement: 'top-end',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 10],
                      },
                    },
                  ],
                }}
              />
            </div>
          )}
          {motionState === MotionState.Escalation &&
            motionDomain !== ROOT_DOMAIN_ID &&
            userHasProfile && (
              <div className={motionSpecificStyles.escalation}>
                <ActionButton
                  appearance={{ theme: 'blue', size: 'small' }}
                  submit={ActionTypes.MOTION_ESCALATE}
                  error={ActionTypes.MOTION_ESCALATE_ERROR}
                  success={ActionTypes.MOTION_ESCALATE_SUCCESS}
                  transform={escalateTransform}
                  text={MSG.escalate}
                  /*
                   * @NOTE For the current release the "escalate" functionality
                   * has been disabled due to difficulties in implementing
                   * the events, **after** the motion has been escalated, due
                   * to the `motion.events` array values being reset
                   */
                  disabled
                />
                <QuestionMarkTooltip
                  tooltipText={MSG.escalateTooltip}
                  className={motionSpecificStyles.helpEscalate}
                  tooltipClassName={motionSpecificStyles.tooltip}
                  tooltipPopperOptions={{
                    placement: 'right',
                  }}
                />
              </div>
            )}
        </div>
      </div>
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          <ActionPageMotionContent
            colony={colony}
            colonyAction={colonyAction}
            initiator={initiator}
            isDecision={isDecision}
            actionAndEventValues={actionAndEventValues}
            transactionHash={transactionHash}
            roleTitle={roleTitle}
            userHasProfile={userHasProfile}
            bottomElementRef={bottomElementRef}
            motionId={motionId}
            createdAt={createdAt}
            roleMessageDescriptorId={roleMessageDescriptorId}
          />
        </div>
        <div className={styles.details}>
          {isStakingPhase && (
            <StakingWidgetFlow
              motionId={motionId}
              colony={colony}
              scrollToRef={bottomElementRef}
              isDecision={isDecision}
            />
          )}
          {motionState === MotionState.Voting && (
            <VoteWidget
              colony={colony}
              actionType={actionType}
              motionId={motionId}
              motionDomain={motionDomain}
              scrollToRef={bottomElementRef}
              motionState={motionState}
              transactionTitle={transactionsTitle}
            />
          )}
          {motionState === MotionState.Reveal && (
            <RevealWidget
              colony={colony}
              motionId={motionId}
              scrollToRef={bottomElementRef}
              motionState={motionState}
            />
          )}
          {(isMotionFinished || motionState === MotionState.Escalation) && (
            <FinalizeMotionAndClaimWidget
              colony={colony}
              actionType={actionType}
              motionId={motionId}
              scrollToRef={bottomElementRef}
              motionState={motionState as MotionState}
              fromDomain={fromDomain}
              motionAmount={amount}
              tokenAddress={tokenAddress}
              isDecision={isDecision}
              transactionTitle={transactionsTitle}
            />
          )}
          <DetailsWidget
            actionType={actionType as ColonyMotions}
            recipient={isDecision ? initiator : recipient}
            transactionHash={transactionHash}
            values={{
              ...actionAndEventValues,
              fromDomain:
                actionType === ColonyMotions.EditDomainMotion
                  ? domainMetadata
                  : actionAndEventValues.fromDomain,
            }}
            colony={colony}
          />
        </div>
      </div>
    </div>
  );
};

DefaultMotion.displayName = displayName;

export default DefaultMotion;
