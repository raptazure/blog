module.exports = {
  siteMetadata: {
    title: 'Raptazure',
    description: '时与风',
    keywords: 'blog, gatsbyjs, computer-science',
    siteUrl: 'https://raptazure.github.io',
    lang: 'zh-Hans',
    author: {
      name: 'raptazure',
      twitter: 'https://twitter.com/raptazure',
      github: 'https://github.com/raptazure',
      email: 'raptazure@foxmail.com'
    },
    googleSiteVerificationCode: '',
    baiduSiteVerificationCode: ''
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-gtag',
      options: {
        trackingId: 'UA-128956609-1',
        head: false,
        anonymize: true
      }
    },
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@': 'src'
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              quality: 90,
              linkImagesToOriginal: true,
              withWebp: true
            }
          },
          {
            resolve: 'gatsby-remark-katex',
            options: {
              strict: 'ignore'
            }
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem'
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        // Setting a color is optional.
        color: 'dimgray',
        // Disable the loading spinner.
        showSpinner: false
      }
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://raptazure.github.io'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Time and Wind',
        short_name: '时与风',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        display: 'minimal-ui',
        icon: 'src/images/icon.png'
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
            {
              site {
                siteMetadata {
                  title
                  description
                  siteUrl
                }
              }
            }
          `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges
                .filter((edge) => edge.node.fields.slug.startsWith('/posts'))
                .map((edge) => {
                  return {
                    ...edge.node.frontmatter,
                    description: edge.node.excerpt,
                    data: edge.node.frontmatter.date,
                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    custom_elements: [{ 'content:encoded': edge.node.html }]
                  };
                });
            },
            query: `
              {
                allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
                  edges {
                    node {
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                      html
                    }
                  }
                }
              }
              `,
            output: '/rss.xml',
            title: `Time and Wind | RSS Feed`,
            site_url: `https://raptazure.github.io`
          }
        ]
      }
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-emotion',
    'gatsby-plugin-sass',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-meta-redirect'
  ]
};
