import * as React from 'react';

import { RoughNotation, RoughNotationProps } from 'react-rough-notation';

const Annotation: React.FC<RoughNotationProps> = ({ children, type, color }) => {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  return hydrated ? (
    <RoughNotation show type={type} color={color} animationDelay={500} strokeWidth={2} multiline>
      {children}
    </RoughNotation>
  ) : (
    children
  );
};

export const Highlight: React.FC<RoughNotationProps> = ({ children }) => (
  <Annotation type="highlight" color="gold">
    {children}
  </Annotation>
);

export const Underline: React.FC<RoughNotationProps> = ({ children }) => (
  <Annotation type="underline" color="dodgerblue">
    {children}
  </Annotation>
);

export const Box: React.FC<RoughNotationProps> = ({ children }) => (
  <Annotation type="box" color="green">
    {children}
  </Annotation>
);

export const Circle: React.FC<RoughNotationProps> = ({ children }) => (
  <Annotation type="circle" color="crimson">
    {children}
  </Annotation>
);

export default Annotation;
