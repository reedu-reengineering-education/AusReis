import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";
import { Badge } from "../ui/badge";
import { Tailwind } from "@react-email/tailwind";

interface EnhancedExpenseNotificationProps {
  amount: number;
  description: string;
  category: string;
  createdBy: string;
  projectName: string;
  projectStatus: string;
  expenseStatus: string;
}

export default function EnhancedExpenseNotification({
  amount,
  description,
  category,
  createdBy,
  projectName,
  projectStatus,
  expenseStatus,
}: EnhancedExpenseNotificationProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  };

  const getStatusBadgeColor = (projectStatus: string) => {
    switch (projectStatus) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "compelted":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>New Expense Alert: {projectName}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto p-4 max-w-xl">
            <Section className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Section className="bg-[#EB5C37] p-6">
                <Heading className="text-2xl font-bold text-white m-0">
                  New Expense Notification
                </Heading>
              </Section>
              <Section className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Text className="text-xl font-semibold text-gray-600">
                    Project Name:{" "}
                  </Text>
                  <Text className="text-xl font-semibold text-gray-800">
                    {projectName}
                  </Text>
                  <Badge
                    className={`${getStatusBadgeColor(
                      projectStatus
                    )} px-4 py-2 text-sm`}
                  >
                    {projectStatus}
                  </Badge>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 transition-all duration-300 hover:bg-gray-100">
                  <Text className="font-semibold text-gray-700">
                    New Expense Details
                  </Text>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Text className="text-gray-600">Amount:</Text>
                    <Text className="font-medium">
                      {formatCurrency(amount)}
                    </Text>
                    <Text className="text-gray-600">Category:</Text>
                    <Text className="font-medium">{category}</Text>
                    <Text className="text-gray-600">Created By:</Text>
                    <Text className="font-medium">{createdBy}</Text>
                    {/* <Text className="text-gray-600">Status:</Text>
                    <Badge>{expenseStatus}</Badge> */}
                    <Text className="text-sm text-gray-600">Description: </Text>
                    <Text className="font-medium">{description}</Text>
                  </div>
                </div>
                <Text className="text-sm text-gray-600 italic">
                  Please review this expense at your earliest convenience. If
                  you have any questions, contact the expense creator or the
                  finance department.
                </Text>
                <Section className="text-center">
                  <Link
                    href="#"
                    className="inline-block bg-[#EB5C37] text-white py-3 px-6 rounded-lg text-sm font-semibold no-underline transition-all duration-300 hover:bg-[#D64A2A] hover:shadow-md hover:-translate-y-0.5"
                  >
                    Review Expense
                  </Link>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
