'use client';

// Dummy inquiries data
const DUMMY_INQUIRIES = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567', property: { title: 'Modern Luxury Villa' }, createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: false },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-987-6543', property: { title: 'Cozy Suburban Home' }, createdAt: new Date(Date.now() - 2*86400000).toISOString(), isRead: true },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com', phone: '555-456-7890', property: null, createdAt: new Date(Date.now() - 3*86400000).toISOString(), isRead: false },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', phone: '555-789-0123', property: { title: 'Waterfront Plot' }, createdAt: new Date(Date.now() - 4*86400000).toISOString(), isRead: true },
];

export default function AdminInquiriesPage() {
  return (
    <main className="min-h-screen bg-admin-bg text-white p-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Inquiries</h1>

      <div className="bg-admin-card rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Property</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Read</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_INQUIRIES.map((inquiry) => (
              <tr key={inquiry.id} className="border-t border-gray-700">
                <td className="p-4">{inquiry.name}</td>
                <td className="p-4">{inquiry.email}</td>
                <td className="p-4">{inquiry.phone}</td>
                <td className="p-4">{inquiry.property?.title || 'General'}</td>
                <td className="p-4">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${inquiry.isRead ? 'bg-gray-700' : 'bg-yellow-900 text-yellow-300'}`}>
                    {inquiry.isRead ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
