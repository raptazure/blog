import { dimensions, colors, breakpoints } from '@/styles/variables';
import { getEmSize } from '@/styles/mixins';

export default `
  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  html {
    font-size: ${dimensions.fontSize.regular}px !important;
    line-height: ${dimensions.lineHeight.regular} !important;
    font-variant-numeric: lining-nums;
  }

  body {
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    color: ${colors.black};
    background-color: ${colors.white};
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  a {
    color: ${colors.black};
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  article {
    a {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    object-fit: contain;
    position: relative;
  }

  figure {
    margin: 2rem 0;
  }

  figcaption {
    font-size: 80%;
  }

  table {
    width: 100%;
    margin-bottom: 1rem;
    border: 1px solid ${colors.ui.light};
    font-size: 85%;
    border-collapse: collapse;
  }

  td,
  th {
    padding: .25rem .5rem;
    border: 1px solid ${colors.ui.light};
  }

  th {
    text-align: left;
  }

  tbody {
    tr {
      &:nth-of-type(odd) {
        td {
          background-color: ${colors.ui.whisper};
        }
        tr {
          background-color: ${colors.ui.whisper};
        }
      }
    }
  }

  dt {
    font-weight: bold;
  }

  dd {
    margin-bottom: .5rem;
  }

  hr {
    position: relative;
    margin: 1.5rem 0;
    border: 0;
    border-top: 1px solid ${colors.ui.light};
  }

  blockquote {
    margin: 0 0;

    border-left: .2rem solid ${colors.brand};
    color: ${colors.brand};

    p {
      margin-top: 0;
      margin-bottom: 0;
    }

    padding-left: 1rem;
    @media (min-width: ${getEmSize(breakpoints.temp)}em) {
      padding-right: 5rem;
    }
  }

  pre, code, kbd {
    font-variant-ligatures: none;
  }

  .katex {
    font-size: 1em !important;
  }

  .katex-display > .katex {
    max-width: 100%;
  }

  .katex-display > .katex > .katex-html {
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .footnotes {
    font-size: 0.8rem;
  }

  .footnote-backref, .footnote-ref {
    text-decoration: none;
  }
`;
