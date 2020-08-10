import * as React from 'react';
import { graphql } from 'gatsby';

import Page from '@/components/Page';
import Container from '@/components/Container';
import IndexLayout from '@/layouts';
import PostEntry from '@/components/PostEntry';

const IndexPage: React.FC<IndexPageProps> = ({ data }) => (
  <IndexLayout>
    <Page>
      <Container>
        <ul style={{ listStyleType: 'none' }}>
          {data.allMdx.edges
            .filter(({ node }) => node.fields.layout === 'post')
            .map(({ node }) => {
              const { title, date } = node.frontmatter;
              const { slug } = node.fields;
              return <PostEntry key={slug} slug={slug} title={title} date={date} />;
            })}
        </ul>
      </Container>
    </Page>
  </IndexLayout>
);

export default IndexPage;

interface IndexPageProps {
  data: {
    allMdx: {
      edges: {
        node: {
          fields: {
            layout: string;
            slug: string;
          };
          frontmatter: {
            date: string;
            title: string;
          };
        };
      }[];
    };
  };
}

export const pageQuery = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            layout
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
          }
        }
      }
    }
  }
`;
