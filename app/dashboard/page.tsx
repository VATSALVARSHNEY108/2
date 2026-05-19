import { getSubjectsFromFS } from "@/lib/content-registry";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const subjects = await getSubjectsFromFS();
  // Artificial delay to show skeleton
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return <DashboardClient subjects={subjects} />;
}
