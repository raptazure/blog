import * as React from 'react';
import styled from '@emotion/styled';
import { transparentize } from 'polished';
import { Link } from 'gatsby';

import { heights, dimensions, colors } from '@/styles/variables';
import Container from '@/components/Container';

const StyledHeader = styled.header`
  height: ${heights.header}px;
  padding: 0 ${dimensions.containerPadding}rem;

  color: ${transparentize(0.5, colors.white)};
`;

const HeaderInner = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  flex: 4 1 120px;
`;

const HomepageLink = styled(Link)`
  color: ${colors.black};
  font-size: 1.8rem;
  margin-right: 1rem;
  font-family: 'Noto Serif JP', serif;
  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const AboutLink = styled(Link)`
  color: ${colors.black};
  font-size: 1rem;
  margin-right: 1rem;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const DiaryLink = styled(Link)`
  color: ${colors.black};
  font-size: 1rem;
  margin-right: 1rem;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const FriendLink = styled(Link)`
  color: ${colors.black};
  font-size: 1rem;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = () => (
  <StyledHeader>
    <HeaderInner>
      <HomepageLink to="/" lang="ja">
        朝の祈り
      </HomepageLink>
      <span>
        <AboutLink to="/about">About</AboutLink>
        <DiaryLink to="/todo">Todo</DiaryLink>
        <FriendLink to="/friends">Friends</FriendLink>
      </span>
    </HeaderInner>
  </StyledHeader>
);

export default Header;
