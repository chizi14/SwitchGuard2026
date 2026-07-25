import Shell from "../Components/Shell";
import Card from "../Components/Card";

export default function CustomerDashboard() {
  return (
    <Shell mobileTitle="Dashboard" showSearch>
      <Card className="text-center py-16 border-2 border-dashed border-outline-variant">
        <p className="text-sm font-semibold text-on-surface-variant">Customer dashboard — to be built</p>
        <p className="text-xs text-outline mt-1">Owner: Zai / Angella</p>
      </Card>
    </Shell>
  );
}
