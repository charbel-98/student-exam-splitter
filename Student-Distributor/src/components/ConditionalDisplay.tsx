import { ReactNode } from 'react';

function ConditionalDisplay({
  condition,
  children,
}: {
  condition: boolean;
  children: ReactNode;
}) {
  return <>{condition && children}</>;
}

export default ConditionalDisplay;
