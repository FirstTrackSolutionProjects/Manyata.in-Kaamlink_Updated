import { BookingTable, Panel } from "./AdminShared";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

function BookingsView({ data = {}, rows, mutate }) { return <Panel title="Booking management"><BookingTable rows={rows} mutate={mutate} professionals={data.professionals || []} /></Panel>; }

export default function BookingsPage() {
  const resource = useAdminSection("/admin/bookings");
  return <AdminPageFrame title="Bookings" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <BookingsView data={resource.data} rows={resource.data?.bookings || []} mutate={resource.mutate} />
  </AdminPageFrame>;
}
