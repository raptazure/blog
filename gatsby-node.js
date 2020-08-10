const path = require('path');

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Sometimes, optional fields tend to get not picked up by the GraphQL
  // interpreter if not a single content uses it. Therefore, we're putting them
  // through `createNodeField` so that the fields still exist and GraphQL won't
  // trip up. An empty string is still required in replacement to `null`.

  // eslint-disable-next-line default-case
  switch (node.internal.type) {
    case 'Mdx': {
      const { permalink, layout, lang, date } = node.frontmatter;
      const { relativePath } = getNode(node.parent);

      let slug = permalink;

      if (!slug) {
        slug = `/${relativePath.replace('.mdx', '').replace('.md', '')}/`;
      }

      const d = new Date(date);

      const legacySlug = `/${d.getFullYear()}/${`0${d.getMonth() + 1}`.slice(-2)}/${`0${d.getDate()}`.slice(-2)}/${slug.replace(
        '/posts/',
        ''
      )}`;

      createNodeField({
        node,
        name: 'slug',
        value: slug || ''
      });

      createNodeField({
        node,
        name: 'layout',
        value: layout || 'post'
      });

      createNodeField({
        node,
        name: 'lang',
        value: lang || 'zh-Hans'
      });

      createNodeField({
        node,
        name: 'legacySlug',
        value: legacySlug || '/void/'
      });
    }
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  const allMdx = await graphql(`
    {
      allMdx(limit: 1000) {
        edges {
          node {
            fields {
              layout
              slug
              legacySlug
            }
          }
        }
      }
    }
  `);

  if (allMdx.errors) {
    throw new Error(allMdx.errors);
  }

  allMdx.data.allMdx.edges.forEach(({ node }) => {
    const { slug, layout, legacySlug } = node.fields;

    createPage({
      path: slug,
      // This will automatically resolve the template to a corresponding
      // `layout` frontmatter in the Markdown.
      //
      // Feel free to set any `layout` as you'd like in the frontmatter, as
      // long as the corresponding template file exists in src/templates.
      // If no template is set, it will fall back to the default `page`
      // template.
      //
      // Note that the template has to exist first, or else the build will fail.
      component: path.resolve(`./src/templates/${layout || 'post'}.tsx`),
      context: {
        // Data passed to context is available in page queries as GraphQL variables.
        slug
      }
    });
    createRedirect({ fromPath: legacySlug.slice(0, -1), toPath: slug.slice(0, -1), isPermanent: true });
  });
};
