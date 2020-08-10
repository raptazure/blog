import * as React from 'react';
import { graphql, Link } from 'gatsby';
import { Helmet } from 'react-helmet';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Page from '@/components/Page';
import Container from '@/components/Container';
import IndexLayout from '@/layouts';

const AboutTemplate: React.FC<AboutTemplateProps> = ({ data }) => (
  <IndexLayout>
    <Helmet title={`${data.mdx.frontmatter.title} | ${data.site.siteMetadata.title}`} />
    <Page>
      <Container>
        <article lang={data.mdx.fields.lang}>
          <h1>{data.mdx.frontmatter.title}</h1>
          <MDXProvider components={{ Link }}>
            <MDXRenderer>{data.mdx.body}</MDXRenderer>
          </MDXProvider>
        </article>
      </Container>
    </Page>
  </IndexLayout>
);

export default AboutTemplate;

interface AboutTemplateProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: {
          name: string;
          twitter: string;
          github: string;
        };
      };
    };
    mdx: {
      body: string;
      excerpt: string;
      fields: {
        lang: string;
      };
      frontmatter: {
        title: string;
        lang: string;
      };
    };
  };
}

export const query = graphql`
  query AboutTemplateQuery($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author {
          name
          twitter
          github
        }
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt
      fields {
        lang
      }
      frontmatter {
        title
      }
    }
  }
`;
