export async function retryOnError<T>(
  delegate: () => T | Promise<T>,
  { retries = 3, delay = 0 } = {},
): Promise<T> {
  let error: Error;

  for (let i = 0; i < retries; i++) {
    try {
      return await delegate();
    } catch (e) {
      error = e;

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw error;
}
