import AdminMessagesTable from "@/features/admin/components/admin-messages-table";
import AdminSectionCard from "@/features/admin/components/admin-section-card";
import {
  listAdminContactMessages,
  listAdminNewsletterSubscribers,
} from "@/lib/customer-messages";

export default async function AdminMessagesPage() {
  const [messages, subscribers] = await Promise.all([
    listAdminContactMessages(),
    listAdminNewsletterSubscribers(),
  ]);

  return (
    <AdminSectionCard title="Messages & Subscribers">
      <AdminMessagesTable
        messages={messages.map((message) => ({
          id: message.id,
          name: message.name,
          email: message.email,
          phone: message.phone,
          subject: message.subject,
          message: message.message,
          status: message.status,
          createdAt: message.createdAt.toISOString(),
        }))}
        subscribers={subscribers.map((subscriber) => ({
          id: subscriber.id,
          email: subscriber.email,
          status: subscriber.status,
          source: subscriber.source,
          createdAt: subscriber.createdAt.toISOString(),
        }))}
      />
    </AdminSectionCard>
  );
}
