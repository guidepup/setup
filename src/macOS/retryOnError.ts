export async function retryOnError<T>(
  delegate: () => T | Promise<T>,
  { retries = 3 } = {
    retries: 3,
  }
): Promise<T> {
  let error: Error;

  for (let i = 0; i < retries; i++) {
    try {
      return await delegate();
    } catch (e) {
      error = e;
    }
  }

  throw error;
}
