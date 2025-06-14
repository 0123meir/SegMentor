const RETRY_COUNT = 3;
const BASE_DELAY_MS = 1_000;

type RetryOptions = {
  retryCount?: number;
  delayMS?: number;
  onAttemptError?: (attempt: number, retryCount: number, error: any) => void;
  onRetryCountReached?: (retryCount: number, error: any) => void;
};

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  retryCount: RETRY_COUNT,
  delayMS: BASE_DELAY_MS,
};

export const executeAsyncWithRetry = async <T>(
  executeFn: () => Promise<T>,
  retryOptions = DEFAULT_RETRY_OPTIONS,
): Promise<T> => {
  const retryCount = retryOptions?.retryCount ?? RETRY_COUNT;
  const delayMS = retryOptions?.delayMS ?? BASE_DELAY_MS;

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      return await executeFn();
    } catch (err) {
      retryOptions.onAttemptError?.(attempt, retryCount, err);

      if (attempt === retryCount) {
        if (retryOptions.onRetryCountReached) {
          retryOptions.onRetryCountReached(retryCount, err);
        } else {
          throw new Error(
            `Failed after ${retryCount} attempts - ${err.message}`,
          );
        }
      } else {
        await sleep(delayMS * attempt);
      }
    }
  }
};

const sleep = (delayMS: number) =>
  new Promise((res) => setTimeout(res, delayMS));
