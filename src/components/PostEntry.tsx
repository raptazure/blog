import * as React from 'react';
import { Link } from 'gatsby';
import Time from '@/components/Time';
import styled from '@emotion/styled';

interface PostEntryProps {
  slug: string;
  date: string;
  title: string;
}

const PostEntryContainer = styled.li`
  display: flex;
  @media (max-width: 350px) {
    flex-direction: column;
  }
`;

const PostEntry: React.FC<PostEntryProps> = ({ slug, date, title }) => (
  <PostEntryContainer>
    <span style={{ flexGrow: 0, flexShrink: 0 }}>
      <Time>{date}</Time>
    </span>
    <span>
      <Link to={slug}>{title}</Link>
    </span>
  </PostEntryContainer>
);

export default PostEntry;
