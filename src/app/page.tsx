import { Suspense } from "react";
import { ProfileGrid } from "./profileGrid";

export default async function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <Suspense>
        <ProfileGrid />
      </Suspense>
    </div>
  );
}
