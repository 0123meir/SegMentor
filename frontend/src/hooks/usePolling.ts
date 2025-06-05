import { useEffect, useRef } from 'react';

type PollingParams = {
  intervalMS: number;
  timeoutMS?: number;
  onCondition?: boolean;
  pollFunction: () => void;
};

export const usePolling = ({
  intervalMS,
  timeoutMS,
  onCondition,
  pollFunction,
}: PollingParams) => {
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const pollingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (onCondition || onCondition === undefined) {
      pollingInterval.current = setInterval(pollFunction, intervalMS);

      if (timeoutMS) {
        pollingTimeout.current = setTimeout(() => {
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }
        }, timeoutMS);
      }
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }

      if (pollingTimeout.current) {
        clearTimeout(pollingTimeout.current);
      }
    };
  }, [pollFunction, intervalMS, onCondition, timeoutMS]);
};
