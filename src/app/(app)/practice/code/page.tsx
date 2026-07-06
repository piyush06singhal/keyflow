/**
 * Code Practice Page Entry
 *
 * Forces dynamic rendering to prevent build-time static generation (prerendering) failures.
 */

import CodePracticeClient from "./CodePracticeClient";

export const dynamic = "force-dynamic";

export default function CodePracticePage() {
  return <CodePracticeClient />;
}
