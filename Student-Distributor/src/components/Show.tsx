import { Children, ReactNode } from "react";

interface ShowWhenProps {
  isTrue: boolean;
  children: ReactNode;
}
interface ShowElseProps {
  render?: ReactNode;
  children: ReactNode;
}
export function Show(props) {
  let when: React.ReactNode | null = null;
  let otherwise: React.ReactNode | null = null;
  Children.forEach(props.children, (children) => {
    if (children.props.isTrue === undefined) {
      otherwise = children;
    } else if (!when && children.props.isTrue) {
      when = children;
    }
  });

  return when || otherwise;
}

Show.When = ({ isTrue, children }: ShowWhenProps) => isTrue && children;
Show.Else = ({ render, children }: ShowElseProps) => render || children;
