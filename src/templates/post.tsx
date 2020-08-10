import * as React from 'react';
import { graphql, Link } from 'gatsby';
import { Helmet } from 'react-helmet';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Page from '@/components/Page';
import Time from '@/components/Time';
import Tag from '@/components/Tag';
import Container from '@/components/Container';
import IndexLayout from '@/layouts';

const PostTemplate: React.FC<PostTemplateProps> = ({ data }) => (
  <IndexLayout>
    <Helmet
      title={`${data.mdx.frontmatter.title} | ${data.site.siteMetadata.title}`}
      meta={[{ name: 'twitter:title', content: `${data.mdx.frontmatter.title} | ${data.site.siteMetadata.title}` }]}
    />
    <Page>
      <Container>
        <article lang={data.mdx.fields.lang}>
          <h1>{data.mdx.frontmatter.title}</h1>
          <Time>{data.mdx.frontmatter.date}</Time>
          {data.mdx.frontmatter.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          <MDXProvider components={{ Link }}>
            <MDXRenderer>{data.mdx.body}</MDXRenderer>
          </MDXProvider>
        </article>
      </Container>
    </Page>
  </IndexLayout>
);

export default PostTemplate;

interface PostTemplateProps {
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
        date: string;
        tags: string[];
      };
    };
  };
}

export const query = graphql`
  query PostTemplateQuery($slug: String!) {
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
        date(formatString: "YYYY-MM-DD")
        tags
      }
    }
  }
`;
