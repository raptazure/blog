import * as React from 'react';
import styled from '@emotion/styled';
import { transparentize } from 'polished';
import { Link } from 'gatsby';

import { heights, dimensions, colors } from '@/styles/variables';
import Container from '@/components/Container';

const StyledFooter = styled.footer`
  height: ${heights.header}px;
  padding: 0 ${dimensions.containerPadding}rem;
  color: ${transparentize(0.5, colors.white)};
`;

const FooterInner = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const Copyright = styled(Link)`
  color: ${colors.gray.calm};

  font-size: 0.8rem;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

interface FooterProps {
  author: {
    name: string;
  };
  buildTime: string;
}

const Footer: React.FC<FooterProps> = ({ author, buildTime }) => (
  <StyledFooter>
    <FooterInner>
      <Copyright to="/about">
        Copyright © {buildTime} {author.name}. Built with Gatsby.
      </Copyright>
    </FooterInner>
  </StyledFooter>
);

export default Footer;
