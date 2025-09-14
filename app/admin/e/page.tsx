import { getAllElections } from "@/actions/admin.action";
import ElectionList from "./components/election-list";

export default async function ElectionListPage() {
  const elections = await getAllElections();
  console.log(elections);

  return <ElectionList elections={elections} />;
}
