import * as React from 'react';
import styled from '@emotion/styled';

const StyledTime = styled.time`
  color: #808080;
  min-width: 200px;
  margin-right: 1rem;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums lining-nums;
`;

const Time: React.FC = ({ children }) => <StyledTime>{children}</StyledTime>;

export default Time;
