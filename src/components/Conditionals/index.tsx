import React, {ReactElement} from 'react';

type BoolOrFunction = boolean | Function;

interface IfElseProps {
  condition: boolean;
  then?: React.ReactNode | React.ReactNode[];
  else?: React.ReactNode | React.ReactNode[];
}

interface IfProps {
  condition: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export default function IfElse(props: IfElseProps) {
  const condition = props.condition || false;
  const positive = props.then || null;
  const negative = props.else || null;

  if (condition) {
    if (typeof positive === 'function') {
      return positive();
    }
    return positive;
  }
  if (typeof negative === 'function') {
    return negative();
  }
  return negative;
}

const render = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  if (typeof children === 'function') {
    return <>{children()}</>;
  }

  return <>{children || null}</>;
};

function getConditionResult(condition: BoolOrFunction) {
  const conditionResult = !!(typeof condition === 'function'
    ? condition()
    : condition);

  return conditionResult;
}

export const Then = (props: {children: React.ReactNode | React.ReactNode[]}) =>
  render(props);

export const Else = (props: {children: React.ReactNode | React.ReactNode[]}) =>
  render(props);

export const If = ({condition, children}: IfProps) => {
  if (children == null) {
    return null;
  }
  if (typeof children === 'function') {
    return children(condition);
  }
  return (
    ([] as Array<React.ReactNode>)
      .concat(children)
      .find(
        c =>
          ((c as ReactElement).type !== Else) !==
          !getConditionResult(condition!),
      ) || null
  );
};

export const Case = (props: {
  children: React.ReactNode | React.ReactNode[];
  condition: boolean;
}) => render(props);

export const Default = (props: {
  children: React.ReactNode | React.ReactNode[];
}) => render(props);

export function Switch({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  // -- Inspired from react-router --

  // We use React.Children.forEach instead of React.Children.toArray().find()
  // here because toArray adds keys to all child elements and we do not want
  // to trigger an unmount/remount for two children <Case>s or <Default>s
  let matchingCase: React.ReactNode = null;
  let defaultCase: React.ReactNode = null;

  React.Children.forEach(children, child => {
    // not a valid react child, don't add it
    if (!React.isValidElement(child)) {
      return;
    }

    if (!matchingCase && child.type === Case) {
      const {condition} = child.props;

      const conditionResult = getConditionResult(condition);

      if (conditionResult) {
        matchingCase = child;
      } // else not matching condition, don't add it
    } else if (!defaultCase && child.type === Default) {
      defaultCase = child;
    } // else unknown type, don't add it
  });

  return matchingCase || defaultCase || null;
}
