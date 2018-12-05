/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';

import styles from './Task.css';

import Form from '~core/Fields/Form';
import Heading from '~core/Heading';
import Button, { DialogActionButton } from '~core/Button';
import Assignment from '~core/Assignment';

/*
 * @TODO Temporary, please remove when wiring in the rating modals
 */
import type { OpenDialog } from '~core/Dialog/types';
import type { TaskRecord, UserRecord } from '~types/';

import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskComments from '~dashboard/TaskComments';
import TaskFeed from '~dashboard/TaskFeed';
import TaskClaimReward from '~dashboard/TaskClaimReward';
import TaskSkills from '~dashboard/TaskSkills';

import { TASK_STATE } from '../../records';

import {
  TASK_WORKER_END,
  TASK_WORKER_END_ERROR,
  TASK_WORKER_END_SUCCESS,
  TASK_MANAGER_END,
  TASK_MANAGER_END_ERROR,
  TASK_MANAGER_END_SUCCESS,
  TASK_WORKER_RATE_MANAGER,
  TASK_WORKER_RATE_MANAGER_ERROR,
  TASK_WORKER_RATE_MANAGER_SUCCESS,
  TASK_MANAGER_RATE_WORKER,
  TASK_MANAGER_RATE_WORKER_ERROR,
  TASK_MANAGER_RATE_WORKER_SUCCESS,
} from '../../actionTypes';

import userMocks from './__datamocks__/mockUsers';
import tokensMock from '../Wallet/__datamocks__/mockTokens';

const MSG = defineMessages({
  assignmentFunding: {
    id: 'dashboard.Task.assignmentFunding',
    defaultMessage: 'Assignment and Funding',
  },
  details: {
    id: 'dashboard.Task.details',
    defaultMessage: 'Details',
  },
  backButton: {
    id: 'dashboard.Task.backButton',
    defaultMessage: 'Go to {colonyName}',
  },
  completed: {
    id: 'dashboard.Task.completed',
    defaultMessage: 'Task completed',
  },
  submitWork: {
    id: 'dashboard.Task.submitWork',
    defaultMessage: 'Submit Work',
  },
  rateWorker: {
    id: 'dashboard.Task.rateWorker',
    defaultMessage: 'Rate Worker',
  },
  rateManager: {
    id: 'dashboard.Task.rateManager',
    defaultMessage: 'Rate Manager',
  },
});

type Props = {
  openDialog: OpenDialog,
  task: TaskRecord,
  taskReward: Object,
  user: UserRecord,
  isTaskCreator?: boolean,
  preventEdit?: boolean,
  userClaimedProfile?: boolean,
};

class Task extends Component<Props> {
  displayName = 'dashboard.Task';

  openTaskEditDialog = () => {
    const { openDialog, task } = this.props;
    const payouts = task.payouts.map(payout => ({
      token:
        // we add 1 because Formik thinks 0 is empty
        tokensMock.indexOf(
          tokensMock.find(token => token.tokenSymbol === payout.symbol),
        ) + 1,
      amount: payout.amount,
      id: nanoid(),
    }));

    openDialog('TaskEditDialog', {
      assignee: task.assignee,
      availableTokens: tokensMock,
      maxTokens: 2,
      payouts,
      reputation: task.reputation,
      users: userMocks,
    });
  };

  get additionalValues() {
    const {
      task: { colonyIdentifier, id: taskId },
    } = this.props;
    return {
      colonyIdentifier,
      taskId,
    };
  }

  get isWorker() {
    const {
      task: { assignee },
      user,
    } = this.props;
    return (
      !!assignee &&
      assignee.walletAddress.toLowerCase() === user.walletAddress.toLowerCase()
    );
  }

  get isManager() {
    const {
      task: { creator },
      user,
    } = this.props;
    return creator.toLowerCase() === user.walletAddress.toLowerCase();
  }

  get dueDatePassed() {
    const {
      task: { dueDate },
    } = this.props;
    return !!dueDate && dueDate < new Date();
  }

  get canClaimPayout() {
    const {
      task: { currentState, workerPayoutClaimed, managerPayoutClaimed },
    } = this.props;
    return (
      currentState === TASK_STATE.FINALIZED &&
      ((this.isWorker && !workerPayoutClaimed) ||
        (this.isManager && !managerPayoutClaimed))
    );
  }

  render() {
    const {
      isTaskCreator = false,
      preventEdit = true,
      task,
      taskReward,
      user,
      userClaimedProfile = false,
    } = this.props;
    const {
      additionalValues,
      isWorker,
      isManager,
      dueDatePassed,
      canClaimPayout,
    } = this;
    return (
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <section className={styles.section}>
            <header className={styles.headerAside}>
              <Heading
                appearance={{ size: 'normal' }}
                text={MSG.assignmentFunding}
              />
              {preventEdit && (
                <Button
                  appearance={{ theme: 'blue' }}
                  text={MSG.details}
                  onClick={this.openTaskEditDialog}
                />
              )}
            </header>
            <Form
              /* eslint-disable-next-line no-console */
              onSubmit={console.log}
            >
              {/*
               * TODO: replace this with TaskAssignment component in colonyDapp#445
               *
               * This should also add in a `readOnly` prop for the `SingleUserPicker`
               * to prevent opening when the task has been finalized.
               *
               * See:
               * https://github.com/JoinColony/colonyDapp/pull/460#issuecomment-437870446
               */}
              <Assignment
                assignee={task.assignee}
                reputation={task.reputation}
                payouts={task.payouts}
                nativeToken="CLNY"
              />
            </Form>
          </section>
          <section className={styles.section}>
            <Form
              /* eslint-disable-next-line no-console */
              onSubmit={console.log}
              initialValues={{
                taskTitle: task.title,
              }}
            >
              <TaskDescription isTaskCreator={preventEdit} />
            </Form>
          </section>
          <section className={styles.section}>
            <div className={styles.editor}>
              <TaskDomains isTaskCreator={preventEdit} />
            </div>
            <div className={styles.editor}>
              <TaskSkills isTaskCreator={preventEdit} />
            </div>
            <div className={styles.editor}>
              <TaskDate isTaskCreator={preventEdit} />
            </div>
          </section>
        </aside>
        <div className={styles.container}>
          <section className={styles.header}>
            {task && task.currentState !== TASK_STATE.FINALIZED ? (
              <Fragment>
                <TaskRequestWork
                  isTaskCreator={isTaskCreator}
                  claimedProfile={userClaimedProfile}
                />
                {/*
                 * @TODO This should only be shown, if we're a worker, and the task
                 * has a reward and was finalized (due date passed or work was submitted and rated)
                 */}
                <TaskClaimReward
                  taskReward={taskReward}
                  taskTitle={task.title}
                />
                {/*
                 * @TODO This are temporary buttons to be able to show the rating
                 * modals until they will get wired up.
                 */}
                {/* Worker misses deadline and rates manager */}
                {task.currentState === TASK_STATE.RATING &&
                  isWorker &&
                  !task.workerHasRated && (
                    <DialogActionButton
                      dialog="ManagerRatingDialog"
                      options={{
                        submitWork: false,
                      }}
                      text={MSG.rateManager}
                      submit={TASK_WORKER_RATE_MANAGER}
                      success={TASK_WORKER_RATE_MANAGER_SUCCESS}
                      error={TASK_WORKER_RATE_MANAGER_ERROR}
                      additionalValues={additionalValues}
                    />
                  )}
                {/* Worker submits work, ends task + rates before deadline */}
                {task.currentState !== TASK_STATE.RATING &&
                  isWorker &&
                  !dueDatePassed && (
                    <DialogActionButton
                      dialog="ManagerRatingDialog"
                      options={{
                        submitWork: true,
                      }}
                      text={MSG.submitWork}
                      submit={TASK_WORKER_END}
                      success={TASK_WORKER_END_SUCCESS}
                      error={TASK_WORKER_END_ERROR}
                      additionalValues={additionalValues}
                    />
                  )}
                {/* Worker misses deadline and manager ends task + rates */}
                {task.currentState !== TASK_STATE.RATING &&
                  isManager &&
                  dueDatePassed && (
                    <DialogActionButton
                      dialog="WorkerRatingDialog"
                      options={{
                        workSubmitted: false,
                      }}
                      text={MSG.rateWorker}
                      submit={TASK_MANAGER_END}
                      success={TASK_MANAGER_END_SUCCESS}
                      error={TASK_MANAGER_END_ERROR}
                      additionalValues={additionalValues}
                    />
                  )}
                {/* Worker makes deadline and manager rates worker */}
                {task.currentState === TASK_STATE.RATING && isManager && (
                  <DialogActionButton
                    dialog="WorkerRatingDialog"
                    options={{
                      workSubmitted: true,
                    }}
                    text={MSG.rateWorker}
                    submit={TASK_MANAGER_RATE_WORKER}
                    success={TASK_MANAGER_RATE_WORKER_SUCCESS}
                    error={TASK_MANAGER_RATE_WORKER_ERROR}
                    additionalValues={additionalValues}
                  />
                )}
              </Fragment>
            ) : (
              <Fragment>
                {canClaimPayout ? (
                  /*
                   * @NOTE This is a placeholder until #559 gets merged
                   */
                  <Button text="Claim Rewards" />
                ) : (
                  <p className={styles.completedDescription}>
                    <FormattedMessage {...MSG.completed} />
                  </p>
                )}
              </Fragment>
            )}
          </section>
          <div className={styles.activityContainer}>
            <section className={styles.activity}>
              <TaskFeed
                feedItems={task.feedItems}
                currentUser={user}
                isRevealEnded={task.currentState === TASK_STATE.FINALIZED}
              />
            </section>
            <section className={styles.commentBox}>
              <TaskComments claimedProfile={userClaimedProfile} />
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default Task;
