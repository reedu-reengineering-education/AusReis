import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardCardsProps {
  openExpensesCount: number;
  approvedExpensesCount: number;
  rejectedExpensesCount: number;
  openTravelsCount: number;
  approvedTravelsCount: number;
  rejectedTravelsCount: number;
}

export default function DashboardCards({
  openExpensesCount,
  approvedExpensesCount,
  rejectedExpensesCount,
  openTravelsCount,
  approvedTravelsCount,
  rejectedTravelsCount,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Auslagen-Karte */}
      <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-50 text-white">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-24">
          <p className="text-2xl">Open: {openExpensesCount}</p>
          <p className="text-2xl">Approved: {approvedExpensesCount}</p>
          <p className="text-2xl">Rejected: {rejectedExpensesCount}</p>
        </CardContent>
      </Card>

      {/* Reisen-Karte */}
      <Card className="bg-gradient-to-r from-blue-400 to-indigo-500 opacity-50 text-white">
        <CardHeader>
          <CardTitle>Travels</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-24">
          <p className="text-2xl">Open: {openTravelsCount}</p>
          <p className="text-2xl">Approved: {approvedTravelsCount}</p>
          <p className="text-2xl">Rejected: {rejectedTravelsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}
