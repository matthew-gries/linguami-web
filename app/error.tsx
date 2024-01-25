'use client'; // Error components must be Client components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error">
      <h2>Something went wrong! 😱 Please try refreshing the page</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}