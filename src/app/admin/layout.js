export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      {children}
    </div>
  );
}