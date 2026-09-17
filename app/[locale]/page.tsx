import { HomePage } from "../../components/HomePage";
import { getDataStats } from "../../lib/stats";

// Server component: the dataset is read here so it never ships to the browser.
export default function Page() {
  return <HomePage stats={getDataStats()} />;
}
