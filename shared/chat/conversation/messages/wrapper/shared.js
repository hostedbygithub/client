// @flow
import * as React from 'react'
import {Avatar, Icon, Text, Box} from '../../../../common-adapters'
import {globalStyles, globalMargins, globalColors, isMobile} from '../../../../styles'
import ProfileResetNotice from '../system-profile-reset-notice/container'
import Timestamp from './timestamp'
import LoadMore from './load-more'

import type {Props} from '.'

const colorForAuthor = (user: string, isYou: boolean, isFollowing: boolean, isBroken: boolean) => {
  if (isYou) {
    return globalColors.black_75
  }

  if (isBroken) {
    return globalColors.red
  }
  return isFollowing ? globalColors.green2 : globalColors.blue
}

const UserAvatar = ({author, showImage, onAuthorClick}) => (
  <Box style={_userAvatarStyle}>
    {showImage && <Avatar size={24} username={author} skipBackground={true} onClick={onAuthorClick} />}
  </Box>
)

const Username = ({username, isYou, isFollowing, isBroken, onClick}) => {
  const style = {
    ...(isYou ? globalStyles.italic : null),
    alignSelf: 'flex-start',
    color: colorForAuthor(username, isYou, isFollowing, isBroken),
    backgroundColor: globalColors.white,
    marginBottom: 2,
  }
  return (
    <Text type="BodySmallSemibold" onClick={onClick} className="hover-underline" style={style}>
      {username}
    </Text>
  )
}

const MenuButton = ({onClick}) => (
  <Box className="menu-button">
    <Icon type="iconfont-ellipsis" style={_ellipsisStyle} onClick={onClick} />
  </Box>
)

const EditedMark = () => (
  <Text type="BodySmall" style={_editedStyle}>
    EDITED
  </Text>
)

const Failure = ({failureDescription, onEdit, onRetry}) => {
  const error = `Failed to send${failureDescription ? ` -  ${failureDescription}` : ''}. `
  const resolveByEdit = failureDescription === 'message is too long'
  return (
    <Text type="BodySmall">
      <Text type="BodySmall" style={_failStyleFace}>
        {'┏(>_<)┓'}
      </Text>
      <Text type="BodySmall" style={_failStyle}>
        {' '}
        {error}
      </Text>
      {resolveByEdit && (
        <Text type="BodySmall" style={_failStyleUnderline} onClick={onEdit}>
          Edit
        </Text>
      )}
      {!resolveByEdit && (
        <Text type="BodySmall" style={_failStyleUnderline} onClick={onRetry}>
          Retry
        </Text>
      )}
    </Text>
  )
}

class MessageWrapper extends React.PureComponent<Props> {
  render() {
    const props = this.props
    return (
      <Box style={props.includeHeader ? _containerWithHeaderStyle : _containerNoHeaderStyle}>
        {props.orangeLineAbove && <Box style={orangeLineStyle} />}
        {props.hasOlderResetConversation && (
          <ProfileResetNotice conversationIDKey={props.message.conversationIDKey} />
        )}
        {props.loadMoreType && <LoadMore type={props.loadMoreType} />}
        {props.timestamp && <Timestamp timestamp={props.timestamp} />}
        <Box
          style={{
            ..._flexOneRow,
            ...(props.isFirstNewMessage ? _stylesFirstNewMessage : null),
            ...(props.isSelected ? _stylesSelected : null),
          }}
        >
          <Box style={props.includeHeader ? _rightSideWithHeaderStyle : _rightSideNoHeaderStyle}>
            <UserAvatar
              author={props.author}
              showImage={props.includeHeader}
              onAuthorClick={props.onAuthorClick}
            />
            <Box style={_flexOneColumn} className="message-wrapper">
              {props.includeHeader && (
                <Username
                  username={props.author}
                  isYou={props.isYou}
                  isFollowing={props.isFollowing}
                  isBroken={props.isBroken}
                  onClick={props.onAuthorClick}
                />
              )}
              <Box style={_textContainerStyle} className="message">
                <Box style={_flexOneColumn}>
                  <props.innerClass message={props.message} isEditing={props.isEditing} />
                  {props.isEdited && <EditedMark />}
                </Box>
                {!isMobile && <MenuButton onClick={props.onShowMenu} />}
                {props.isRevoked && <Icon type="iconfont-exclamation" style={_exclamationStyle} />}
              </Box>
              {!!props.failureDescription && (
                <Failure
                  failureDescription={props.failureDescription}
                  onRetry={props.onRetry}
                  onEdit={props.onEdit}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
}

const _flexOneRow = {
  ...globalStyles.flexBoxRow,
  flex: 1,
}

const _flexOneColumn = {
  ...globalStyles.flexBoxColumn,
  flex: 1,
}

const _containerNoHeaderStyle = {
  ...globalStyles.flexBoxColumn,
}

const _containerWithHeaderStyle = {
  ..._containerNoHeaderStyle,
}

const _rightSideNoHeaderStyle = {
  ..._flexOneRow,
  marginLeft: globalMargins.tiny,
  paddingBottom: 2,
  paddingRight: globalMargins.tiny,
}

const _rightSideWithHeaderStyle = {
  ..._rightSideNoHeaderStyle,
  paddingTop: 6,
}

const _stylesFirstNewMessage = {
  borderBottomWidth: 0,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderStyle: 'solid',
  borderTopColor: globalColors.orange,
  borderTopWidth: 1,
}

const _stylesSelected = {
  backgroundColor: globalColors.black_05,
}

const _exclamationStyle = {
  color: globalColors.blue,
  fontSize: 11,
  paddingBottom: globalMargins.xtiny,
  paddingTop: globalMargins.xtiny,
}

const _ellipsisStyle = {
  fontSize: 16,
  marginLeft: globalMargins.tiny,
  marginRight: globalMargins.xtiny,
}

const _textContainerStyle = {
  ...globalStyles.flexBoxRow,
  borderRadius: 4,
  flex: 1,
  marginLeft: -globalMargins.xtiny,
  marginRight: globalMargins.xtiny,
  paddingLeft: globalMargins.xtiny,
  paddingRight: globalMargins.xtiny,
}

const _editedStyle = {
  backgroundColor: globalColors.white,
  color: globalColors.black_20_on_white,
}

const _userAvatarStyle = {
  width: 32,
}

const _failStyle = {
  color: globalColors.red,
}
const _failStyleUnderline = {
  ..._failStyle,
  ...globalStyles.textDecoration('underline'),
}
const _failStyleFace = {
  ..._failStyle,
  fontSize: 9,
}
const orangeLineStyle = {
  backgroundColor: globalColors.orange,
  height: 1,
  width: '100%',
}

export default MessageWrapper
