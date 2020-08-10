import * as React from 'react';
import styled from '@emotion/styled';

const StyledSpan = styled.span`
  color: #808080;
  min-width: 200px;
  margin-right: 0.5em;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums lining-nums;
  text-transform: uppercase;

  &:before {
    content: '#';
  }
`;

const Tag: React.FC = ({ children }) => <StyledSpan>{children}</StyledSpan>;

export default Tag;
