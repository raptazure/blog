import * as React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import '../styles/typography.scss';

interface JournalEntryProps {
  slug: string;
  date: string;
  title: string;
}

const JournalEntryContainer = styled.li`
  display: flex;
  font-family: 'Ubuntu Mono', monospace;
  @media (max-width: 350px) {
    flex-direction: column;
  }
`;

const StyledTime = styled.time`
  color: #808080;
  min-width: 200px;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums lining-nums;
`;

const Time: React.FC = ({ children }) => <StyledTime>{children}</StyledTime>;

const JournalEntry: React.FC<JournalEntryProps> = ({ slug, date, title }) => (
  <JournalEntryContainer>
    <span style={{ flexGrow: 0, flexShrink: 0 }}>
      <Link to={slug}>
        <Time>{date}</Time>
      </Link>
    </span>
    <span style={{ marginLeft: 5 }}>
      <Link to={slug}>{title}</Link>
    </span>
  </JournalEntryContainer>
);

export default JournalEntry;
