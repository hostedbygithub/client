// @flow
// Known issues:
// When input gets focus it shifts down 1 pixel when the cursor appears. This happens with a naked TextInput on RN...
import React, {Component} from 'react'
import Box from './box'
import Text, {getStyle as getTextStyle} from './text'
import {NativeTextInput} from './native-wrappers.native'
import {globalStyles, globalColors} from '../styles'
import {isIOS} from '../constants/platform'

import type {Props} from './input'

type State = {
  focused: boolean,
  height: ?number,
  value: string,
  selections: {selectionStart: number, selectionEnd: number},
}

class Input extends Component<Props, State> {
  state: State
  _input: any

  constructor(props: Props) {
    super(props)

    this.state = {
      focused: false,
      height: null,
      value: props.value || '',
      selections: {selectionStart: 0, selectionEnd: 0},
    }
  }

  setNativeProps(props: Object) {
    this._input && this._input.setNativeProps(props)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hasOwnProperty('value')) {
      this.setState({value: nextProps.value || ''})
    }
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.type !== this.props.type) {
      this._setPasswordVisible(nextProps.type === 'passwordVisible')
    }
  }

  _onContentSizeChange = event => {
    if (
      this.props.multiline &&
      event &&
      event.nativeEvent &&
      event.nativeEvent.contentSize &&
      event.nativeEvent.contentSize.height
    ) {
      let height = event.nativeEvent.contentSize.height
      const minHeight = this.props.rowsMin && this._rowsToHeight(this.props.rowsMin)
      const maxHeight = this.props.rowsMax && this._rowsToHeight(this.props.rowsMax)
      if (minHeight && height < minHeight) {
        height = minHeight
      } else if (maxHeight && height > maxHeight) {
        height = maxHeight
      }

      if (height !== this.state.height) {
        this.setState({height})
      }
    }
  }

  _setPasswordVisible(passwordVisible: boolean) {
    // $FlowIssue
    this._textInput && this._textInput.setNativeProps({passwordVisible})
  }

  getValue(): string {
    return this.state.value || ''
  }

  setValue(value: string) {
    this.setState({value: value || ''})
  }

  clearValue() {
    this._onChangeText('')
  }

  _onChangeText = (text: string) => {
    this.setState({value: text || ''}, () => this.props.onChangeText && this.props.onChangeText(text || ''))
  }

  _inputNode() {
    return this._input
  }

  focus() {
    this._input && this._inputNode().focus()
  }

  select() {
    this._input && this._inputNode().select()
  }

  blur() {
    this._input && this._inputNode().blur()
  }

  _onKeyDown = (e: SyntheticKeyboardEvent<>) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e, false)
    }

    if (this.props.onEnterKeyDown && e.key === 'Enter') {
      this.props.onEnterKeyDown(e)
    }
  }

  _onFocus = () => {
    this.setState({focused: true})
    this.props.onFocus && this.props.onFocus()
  }

  _onBlur = () => {
    this.setState({focused: false})
    this.props.onBlur && this.props.onBlur()
  }

  _lineHeight() {
    if (this.props.small) {
      return 20
    } else return 28
  }

  _underlineColor() {
    if (this.props.hideUnderline) {
      return globalColors.transparent
    }

    if (this.props.errorText && this.props.errorText.length) {
      return globalColors.red
    }

    return this.state.focused ? globalColors.blue : globalColors.black_10
  }

  _rowsToHeight(rows) {
    const border = this.props.hideUnderline ? 0 : 1
    return rows * this._lineHeight() + border
  }

  _containerStyle(underlineColor) {
    return this.props.small
      ? {
          ...globalStyles.flexBoxRow,
          borderBottomWidth: 1,
          borderBottomColor: underlineColor,
          flex: 1,
        }
      : {
          ...globalStyles.flexBoxColumn,
          justifyContent: 'flex-start',
          maxWidth: 400,
        }
  }

  _onSelectionChange = (event: any) => {
    this.setState(
      {
        selections: {
          selectionStart: event.nativeEvent.selection.start,
          selectionEnd: event.nativeEvent.selection.end,
        },
      },
      () => this.props.onSelectionChange && this.props.onSelectionChange(this.state.selections)
    )
  }

  // WARNING may not be up to date in time sensitive situations
  selections() {
    return this.state.selections
  }

  render() {
    const underlineColor = this._underlineColor()
    const lineHeight = this._lineHeight()
    const defaultRowsToShow = Math.min(2, this.props.rowsMax || 2)
    const containerStyle = this._containerStyle(underlineColor)

    const commonInputStyle = {
      color: globalColors.black_75,
      lineHeight: lineHeight,
      backgroundColor: globalColors.transparent,
      flexGrow: 1,
      borderWidth: 0,
      ...(this.props.small
        ? {...globalStyles.fontRegular, fontSize: _bodyTextStyle.fontSize, textAlign: 'left'}
        : {
            ...globalStyles.fontSemibold,
            fontSize: _headerTextStyle.fontSize,
            textAlign: 'center',
            minWidth: 200,
          }),
    }

    const singlelineStyle = {
      ...commonInputStyle,
      maxHeight: lineHeight, // ensure it doesn't grow or shrink
      minHeight: lineHeight,
      padding: 0,
    }

    const multilineStyle = {
      ...commonInputStyle,
      paddingTop: 0,
      paddingBottom: 0,
      minHeight: this._rowsToHeight(this.props.rowsMin || defaultRowsToShow),
      ...(this.props.rowsMax ? {maxHeight: this._rowsToHeight(this.props.rowsMax)} : null),
    }

    // Override height if we received an onContentSizeChange() earlier.
    if (isIOS && this.state.height) {
      multilineStyle.height = this.state.height
    }

    const floatingHintText =
      !!this.state.value.length &&
      (this.props.hasOwnProperty('floatingHintTextOverride')
        ? this.props.floatingHintTextOverride
        : this.props.hintText || ' ')

    const commonProps = {
      autoCorrect: this.props.hasOwnProperty('autoCorrect') && this.props.autoCorrect,
      autoCapitalize: this.props.autoCapitalize || 'none',
      editable: this.props.hasOwnProperty('editable') ? this.props.editable : true,
      keyboardType: this.props.keyboardType,
      autoFocus: this.props.autoFocus,
      onBlur: this._onBlur,
      onChangeText: this._onChangeText,
      onFocus: this._onFocus,
      onKeyDown: this._onKeyDown,
      onSelectionChange: this._onSelectionChange,
      onSubmitEditing: this.props.onEnterKeyDown,
      onEndEditing: this.props.onEndEditing,
      placeholder: this.props.hintText,
      ref: r => {
        this._input = r
      },
      returnKeyType: this.props.returnKeyType,
      value: this.state.value,
      secureTextEntry: this.props.type === 'password',
      underlineColorAndroid: 'transparent',
      ...(this.props.maxLength ? {maxlength: this.props.maxLength} : null),
    }

    const singlelineProps = {
      ...commonProps,
      multiline: false,
      style: {...singlelineStyle, ...this.props.inputStyle},
      type:
        {
          password: 'password',
          text: 'text',
          passwordVisible: 'text',
        }[this.props.type || 'text'] || 'text',
    }

    const multilineProps = {
      ...commonProps,
      multiline: true,
      blurOnSubmit: false,
      onContentSizeChange: isIOS ? this._onContentSizeChange : null,
      style: {...multilineStyle, ...this.props.inputStyle},
    }

    const smallLabelStyle = {
      ...globalStyles.fontSemibold,
      fontSize: _headerTextStyle.fontSize,
      lineHeight: lineHeight,
      marginRight: 8,
      color: globalColors.blue,
      ...this.props.smallLabelStyle,
    }

    return (
      <Box style={{...containerStyle, ...this.props.style}}>
        {!this.props.small && (
          <Text type="BodySmall" style={_floatingStyle}>
            {floatingHintText}
          </Text>
        )}
        {!!this.props.small &&
          !!this.props.smallLabel && (
            <Text type="BodySmall" style={smallLabelStyle}>
              {this.props.smallLabel}
            </Text>
          )}
        <Box style={this.props.small ? {flex: 1} : {borderBottomWidth: 1, borderBottomColor: underlineColor}}>
          <NativeTextInput {...(this.props.multiline ? multilineProps : singlelineProps)} />
        </Box>
        {!this.props.small && (
          <Text type="BodyError" style={{..._errorStyle, ...this.props.errorStyle}}>
            {this.props.errorText || ''}
          </Text>
        )}
      </Box>
    )
  }
}

const _headerTextStyle = getTextStyle('Header')
const _bodyTextStyle = getTextStyle('Body')
const _bodySmallTextStyle = getTextStyle('BodySmall')
const _bodyErrorTextStyle = getTextStyle('BodyError')

const _errorStyle = {
  minHeight: _bodyErrorTextStyle.lineHeight,
  textAlign: 'center',
}

const _floatingStyle = {
  textAlign: 'center',
  minHeight: _bodySmallTextStyle.lineHeight,
  color: globalColors.blue,
  marginBottom: 9,
}

export default Input
