import React, { useEffect, useMemo, useState } from 'react';

import { throttle } from 'lodash';
import ScrollAction from './scroll/ScrollAction';

const Footer = () => {
  const [scrollBtnOpen, setScrollBtnOpen] = useState(false);

  // Scroll Action
  const listener = useMemo(
    () =>
      throttle(() => {
        if (typeof window === undefined) return;

        const open = window.innerHeight / 2 < window.scrollY;
        if (scrollBtnOpen !== open) setScrollBtnOpen(open);
      }, [300]),
    [scrollBtnOpen],
  );

  useEffect(() => {
    window.addEventListener('scroll', listener);

    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, [listener]);

  return <ScrollAction scrollBtn={scrollBtnOpen} />;
};

export default Footer;
