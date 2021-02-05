import * as React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

interface JournalEntryProps {
  slug: string;
  date: string;
}

const JournalEntryContainer = styled.li`
  display: flex;
  @media (max-width: 350px) {
    flex-direction: column;
  }
`;

const StyledTime = styled.time`
  color: #000;
  min-width: 200px;
  margin-left: 0.2rem;
  font-size: 1rem;
  font-variant-numeric: tabular-nums lining-nums;
`;

const Time: React.FC = ({ children }) => <StyledTime>{children}</StyledTime>;

const JournalEntry: React.FC<JournalEntryProps> = ({ slug, date }) => (
  <JournalEntryContainer>
    <span style={{ flexGrow: 0, flexShrink: 0 }}>
      <Link to={slug}>
        <Time>{date}</Time>
      </Link>
    </span>
  </JournalEntryContainer>
);

export default JournalEntry;
