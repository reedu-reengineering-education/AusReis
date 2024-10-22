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
import { Tailwind } from "@react-email/tailwind";

interface Bill {
  file: string;
  amount: number;
}

interface AdminExpenseEditedNotificationProps {
  expenseId: string;
  amount: number;
  description: string;
  status: string;
  category: string;
  bills: Bill[];
  createdBy: string;
  projectName: string;
  projectStatus: string;
  baseUrl: string;
  editedBy: string;
}

export default function AdminExpenseEditedNotification({
  expenseId,
  amount,
  description,
  status,
  category,
  bills,
  createdBy,
  projectName,
  projectStatus,
  baseUrl,
  editedBy,
}: AdminExpenseEditedNotificationProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Your Expense Has Been Edited: {expenseId}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto p-4 max-w-xl">
            <Section className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Section className="bg-[#EB5C37] p-6">
                <Heading className="text-2xl font-bold text-white m-0">
                  Expense Update Notification
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
                  <span
                    className={`${getStatusBadgeColor(
                      projectStatus
                    )} px-4 py-2 text-sm rounded-full`}
                  >
                    {projectStatus}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 transition-all duration-300 hover:bg-gray-100">
                  <Text className="font-semibold text-gray-700">
                    Updated Expense Details
                  </Text>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Text className="text-gray-600">Amount:</Text>
                    <Text className="font-medium">
                      {formatCurrency(amount)}
                    </Text>
                    <Text className="text-gray-600">Category:</Text>
                    <Text className="font-medium">{category}</Text>
                    <Text className="text-gray-600">Status:</Text>
                    <span
                      className={`${getStatusBadgeColor(
                        status
                      )} px-2 py-1 text-xs rounded-full`}
                    >
                      {status}
                    </span>
                    <Text className="text-gray-600">Created By:</Text>
                    <Text className="font-medium">{createdBy}</Text>
                    <Text className="text-gray-600">Edited By:</Text>
                    <Text className="font-medium">{editedBy}</Text>
                    <Text className="text-sm text-gray-600">Description: </Text>
                    <Text className="font-medium">{description}</Text>
                  </div>
                </div>

                <Text className="text-sm text-gray-600 italic">
                  This expense has been updated. If you have any questions about
                  these changes, please contact the finance department.
                </Text>
                <Section className="text-center">
                  <Link
                    href={`${baseUrl}/expenses/${expenseId}`}
                    className="inline-block bg-[#EB5C37] text-white py-3 px-6 rounded-lg text-sm font-semibold no-underline transition-all duration-300 hover:bg-[#D64A2A] hover:shadow-md hover:-translate-y-0.5"
                  >
                    View Expense Details
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
