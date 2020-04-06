import { Accessibility, buttonBehavior, ButtonBehaviorProps } from '@fluentui/accessibility';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as _ from 'lodash';

import {
  childrenExist,
  createShorthandFactory,
  UIComponentProps,
  ChildrenComponentProps,
  commonPropTypes,
  rtlTextContainer,
  ContentComponentProps,
} from '../../utils';

import {
  ComponentEventHandler,
  WithAsProp,
  withSafeTypeForAs,
  FluentComponentStaticProps,
  ProviderContextPrepared,
  ShorthandValue,
} from '../../types';
import { getElementType, useAccessibility, useStyles, useTelemetry, useUnhandledProps } from '@fluentui/react-bindings';
import Box, { BoxProps } from '../Box/Box';
// @ts-ignore
import { ThemeContext } from 'react-fela';

export interface AlertDismissActionProps
  extends UIComponentProps,
    ContentComponentProps<ShorthandValue<BoxProps>>,
    ChildrenComponentProps {
  /** Accessibility behavior if overridden by the user. */
  accessibility?: Accessibility<ButtonBehaviorProps>;

  /** A dismiss action can show that it cannot be interacted with. */
  disabled?: boolean;

  /** An alert may be formatted to display a danger message. */
  danger?: boolean;

  /** An alert can be formatted to display a warning message. */
  warning?: boolean;

  /** An alert can be formatted to display a successful message. */
  success?: boolean;

  /** An alert may be formatted to display information. */
  info?: boolean;

  /**
   * Called after a user clicks the paddle.
   * @param event - React's original SyntheticEvent.
   * @param data - All props.
   */
  onClick?: ComponentEventHandler<AlertDismissActionProps>;
}

export type AlertDismissActionSlotClassNames = {
  content: string;
};

export type AlertDismissActionStylesProps = Pick<
  AlertDismissActionProps,
  'disabled' | 'danger' | 'warning' | 'info' | 'success'
> & {
  hasContent?: boolean;
};

const AlertDismissAction: React.FC<WithAsProp<AlertDismissActionProps>> &
  FluentComponentStaticProps<AlertDismissActionProps> & {
    slotClassNames: AlertDismissActionSlotClassNames;
  } = props => {
  const context: ProviderContextPrepared = React.useContext(ThemeContext);
  const { setStart, setEnd } = useTelemetry(AlertDismissAction.displayName, context.telemetry);
  setStart();

  const {
    accessibility,
    as,
    children,
    className,
    content,
    disabled,
    design,
    styles,
    variables,
    danger,
    warning,
    info,
    success,
  } = props;

  const hasChildren = childrenExist(children);
  const hasContent = !!content && !_.isEmpty(content);

  const getA11Props = useAccessibility(accessibility, {
    debugName: AlertDismissAction.displayName,
    mapPropsToBehavior: () => ({
      as,
      disabled,
    }),
    actionHandlers: {
      performClick: event => {
        event.preventDefault();
        handleClick(event);
      },
    },
    rtl: context.rtl,
  });
  const { classes, styles: resolvedStyles } = useStyles<AlertDismissActionStylesProps>(AlertDismissAction.displayName, {
    className: AlertDismissAction.className,
    mapPropsToStyles: () => ({
      disabled,
      danger,
      warning,
      info,
      success,
      hasContent: hasContent || hasChildren,
    }),
    mapPropsToInlineStyles: () => ({
      className,
      design,
      styles,
      variables,
    }),
    rtl: context.rtl,
  });

  const unhandledProps = useUnhandledProps(AlertDismissAction.handledProps, props);
  const ElementType = getElementType(props);

  const handleClick = (e: React.SyntheticEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    _.invoke(props, 'onClick', e, props);
  };

  const result = (
    <ElementType
      {...rtlTextContainer.getAttributes({ forElements: [children] })}
      {...getA11Props('root', {
        onClick: handleClick,
        disabled,
        className: classes.root,
        ...unhandledProps,
      })}
    >
      {hasChildren
        ? children
        : Box.create(content, {
            defaultProps: () =>
              getA11Props('content', {
                as: 'span',
                className: AlertDismissAction.slotClassNames.content,
                styles: resolvedStyles.content,
              }),
          })}
    </ElementType>
  );

  setEnd();

  return result;
};

AlertDismissAction.defaultProps = {
  as: 'button',
  accessibility: buttonBehavior,
  content: {},
};

AlertDismissAction.displayName = 'AlertDismissAction';
AlertDismissAction.className = 'ui-alert__dismissaction';

AlertDismissAction.propTypes = {
  ...commonPropTypes.createCommon({
    content: 'shorthand',
  }),
  disabled: PropTypes.bool,
  danger: PropTypes.bool,
  warning: PropTypes.bool,
  info: PropTypes.bool,
  onClick: PropTypes.func,
};

AlertDismissAction.handledProps = Object.keys(AlertDismissAction.propTypes) as any;

AlertDismissAction.create = createShorthandFactory({ Component: AlertDismissAction, mappedProp: 'content' });

AlertDismissAction.slotClassNames = {
  content: `${AlertDismissAction.className}__content`,
};

/**
 * A AlertDismissAction allows users to customize the dismissAction slot  inside the Alert component.
 *
 * @accessibility
 * Implements [ARIA Button](https://www.w3.org/TR/wai-aria-practices-1.1/#button) design pattern.
 */
export default withSafeTypeForAs<typeof AlertDismissAction, AlertDismissActionProps, 'button'>(AlertDismissAction);