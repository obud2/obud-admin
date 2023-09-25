import React, { useMemo, useEffect, useRef } from 'react';

import { throttle } from 'lodash';

const InfiniteScrollAction = ({ children, data, fetchNextPage, isFetchingNextPage }) => {
  const scrollRef = useRef();

  const pageScroll = useMemo(
    () =>
      throttle(() => {
        if (scrollRef?.current) {
          if (isFetchingNextPage) return;
          if (!fetchNextPage) return;

          const ele = (scrollRef?.current?.clientHeight ? scrollRef?.current?.clientHeight : 0) - 1000;
          const sc = window?.scrollY;

          if (sc > ele) {
            if (data?.pages[data?.pages?.length ? data?.pages?.length - 1 : 0]?.nextPage) {
              fetchNextPage();
            }
          }
        }
      }, 300),
    [scrollRef, fetchNextPage, isFetchingNextPage, data],
  );

  useEffect(() => {
    window.addEventListener('scroll', pageScroll);

    return () => window.removeEventListener('scroll', pageScroll);
  }, [pageScroll]);

  return (
    <div ref={scrollRef}>
      {children}
      {isFetchingNextPage && <FetchingNextLoading />}
    </div>
  );
};

const FetchingNextLoading = () => {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0px' }}>
      <span className="svg-loading" />
    </div>
  );
};

export default InfiniteScrollAction;
