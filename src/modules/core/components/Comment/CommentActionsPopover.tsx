import React, { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { COMMENT_MODERATION } from '~immutable/index';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { useDialog } from '~core/Dialog';
import CommentDeleteDialog from '~core/CommentDeleteDialog';
import { Props as CommentProps } from './Comment';

import styles from './CommentActionsPopover.css';

const MSG = defineMessages({
  deleteComment: {
    id: 'core.Comment.CommentActionsPopover.deleteComment',
    defaultMessage: 'Delete comment',
  },
  restoreComment: {
    id: 'core.Comment.CommentActionsPopover.restoreComment',
    defaultMessage: 'Restore comment',
  },
  banFromChat: {
    id: 'core.Comment.CommentActionsPopover.banFromChat',
    defaultMessage: 'Ban from chat',
  },
  unBanFromChat: {
    id: 'core.Comment.CommentActionsPopover.unBanFromChat',
    defaultMessage: 'Unban from chat',
  },
});

interface Props {
  closePopover: () => void;
  permission: string;
  fullComment?: CommentProps;
}

const displayName = 'core.Comment.CommentActionsPopover';

const CommentActionsPopover = ({
  closePopover,
  permission,
  fullComment,
}: Props) => {
  const openDeleteCommentDialog = useDialog(CommentDeleteDialog);

  const handleDeleteComment = useCallback(
    () =>
      openDeleteCommentDialog({
        comment: {
          ...fullComment,
          showControls: false,
        } as CommentProps,
      }),
    [fullComment, openDeleteCommentDialog],
  );

  const renderUserActions = () => (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Button
          appearance={{ theme: 'no-style' }}
          onClick={() => closePopover()}
        >
          <div className={styles.actionButton}>
            <Icon name="trash" title={MSG.deleteComment} />
            <FormattedMessage {...MSG.deleteComment} />
          </div>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );

  const renderModeratorOptions = () => (
    <DropdownMenuSection separator>
      {!fullComment?.commentMeta?.adminDelete ? (
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={handleDeleteComment}
          >
            <div className={styles.actionButton}>
              <Icon name="trash" title={MSG.deleteComment} />
              <FormattedMessage {...MSG.deleteComment} />
            </div>
          </Button>
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={() => closePopover()}
          >
            <div className={styles.actionButton}>
              <Icon name="trash" title={MSG.restoreComment} />
              <FormattedMessage {...MSG.restoreComment} />
            </div>
          </Button>
        </DropdownMenuItem>
      )}
      {!fullComment?.commentMeta?.userBanned ? (
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={() => closePopover()}
          >
            <div className={styles.actionButton}>
              <Icon name="circle-minus" title={MSG.banFromChat} />
              <FormattedMessage {...MSG.banFromChat} />
            </div>
          </Button>
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={() => closePopover()}
          >
            <div className={styles.actionButton}>
              <Icon name="circle-minus" title={MSG.unBanFromChat} />
              <FormattedMessage {...MSG.unBanFromChat} />
            </div>
          </Button>
        </DropdownMenuItem>
      )}
    </DropdownMenuSection>
  );

  return (
    <DropdownMenu onClick={closePopover}>
      {permission === COMMENT_MODERATION.CAN_MODERATE ? (
        <>{renderModeratorOptions()}</>
      ) : null}
      {permission === COMMENT_MODERATION.CAN_EDIT ? (
        <>{renderUserActions()}</>
      ) : null}
    </DropdownMenu>
  );
};

CommentActionsPopover.displayName = displayName;

export default CommentActionsPopover;
