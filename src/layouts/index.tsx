import * as React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

import '@/styles/typography.scss';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LayoutRoot from '@/components/LayoutRoot';
import LayoutMain from '@/components/LayoutMain';

interface StaticQueryProps {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      keywords: string;
      author: {
        name: string;
      };
      googleSiteVerificationCode: string;
      baiduSiteVerificationCode: string;
    };
    buildTime: string;
  };
}

const IndexLayout: React.FC = ({ children }) => (
  <StaticQuery
    query={graphql`
      query IndexLayoutQuery {
        site {
          siteMetadata {
            title
            description
            keywords
            author {
              name
            }
            googleSiteVerificationCode
            baiduSiteVerificationCode
          }
          buildTime(formatString: "YYYY")
        }
      }
    `}
    render={(data: StaticQueryProps) => (
      <LayoutRoot>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: data.site.siteMetadata.description },
            { name: 'keywords', content: data.site.siteMetadata.keywords },
            { name: 'google-site-verification', content: data.site.siteMetadata.googleSiteVerificationCode },
            { name: 'baidu-site-verification', content: data.site.siteMetadata.baiduSiteVerificationCode },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:creator', content: '@iimtsuki' },
            { name: 'twitter:site', content: '@iimtsuki' },
            { name: 'twitter:title', content: data.site.siteMetadata.title }
          ]}
        >
          {/* eslint-disable-next-line jsx-a11y/lang */}
          <html lang="zh-Hans" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" />
        </Helmet>
        <Header title={data.site.siteMetadata.title} />
        <LayoutMain>{children}</LayoutMain>
        <Footer author={data.site.siteMetadata.author} buildTime={data.site.buildTime} />
      </LayoutRoot>
    )}
  />
);

export default IndexLayout;
