"use client";

import { useEffect, useState } from "react";

// Shows which environment and build answered, from the web image's own
// release (baked in at build) and the API's.
export default function Home() {
  const [api, setApi] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/visits")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`API answered ${r.status}`))))
      .then(setApi, setError);
  }, []);

  return (
    <main>
      <h1>Sample App</h1>
      <p>Web release: {process.env.NEXT_PUBLIC_VERSION_RELEASE ?? "local"}</p>
      {error && <p role="alert">{error.message}</p>}
      {api && (
        <dl>
          <dt>Environment</dt>
          <dd>{api.env}</dd>
          <dt>API release</dt>
          <dd>{api.version}</dd>
          <dt>Visits in {api.env}</dt>
          <dd>{api.visits}</dd>
        </dl>
      )}
    </main>
  );
}
