import React, { useEffect } from 'react';

const src = 'https://utteranc.es/client.js';
const branch = 'master';
const LIGHT_THEME = 'github-light';

interface CommentProps {
  repo: string;
}

export const Utterances: React.FC<CommentProps> = ({ repo }) => {
  const rootElm = React.createRef<HTMLDivElement>();

  useEffect(() => {
    const utterances = document.createElement('script');
    const utterancesConfig = {
      src,
      repo,
      branch,
      theme: LIGHT_THEME,
      label: 'comment',
      async: true,
      'issue-term': 'pathname',
      crossorigin: 'anonymous'
    };

    Object.keys(utterancesConfig).forEach((configKey) => {
      utterances.setAttribute(configKey, utterancesConfig[configKey]);
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    rootElm.current!.appendChild(utterances);
  }, []);

  return <div className="utterances" style={{ top: 50 }} ref={rootElm} />;
};
