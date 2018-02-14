// @flow
import * as I from 'immutable'
import {DropdownPopupMenu} from './popup'
import {connect, type TypedState} from '../../util/container'

type OwnProps = {
  routeProps: I.Map<'items' | 'isTeamPath' | 'onOpenBreadcrumb', any>,
}

const mapStateToProps = (stateProps: TypedState, {routeProps}: OwnProps) => ({
  isTeamPath: routeProps.get('isTeamPath'),
  items: routeProps.get('items'),
  onOpenBreadcrumb: routeProps.get('onOpenBreadcrumb'),
})

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(DropdownPopupMenu)
