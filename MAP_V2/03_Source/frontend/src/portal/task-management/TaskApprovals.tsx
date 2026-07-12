import { CheckCircle, XCircle, Clock, User } from 'lucide-react';

const mockApprovals = [
  { id: '1', title: 'User Role Change - Admin Access', requester: 'John Smith', approver: 'Sarah Jones', status: 'pending', createdAt: '2026-07-12 09:00', priority: 'high' },
  { id: '2', title: 'Data Migration Approval', requester: 'Mike Chen', approver: 'Emily Davis', status: 'pending', createdAt: '2026-07-11 14:30', priority: 'medium' },
  { id: '3', title: 'Policy Exception Request', requester: 'Alex Wilson', approver: 'John Smith', status: 'approved', createdAt: '2026-07-10 11:15', priority: 'low' },
  { id: '4', title: 'Budget Allocation', requester: 'Sarah Jones', approver: 'Mike Chen', status: 'rejected', createdAt: '2026-07-09 16:45', priority: 'high' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const TaskApprovals = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Approvals</h1>
        <p className="text-neutral-600 mt-1">Review and manage pending approvals</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="divide-y divide-neutral-200">
          {mockApprovals.map((approval) => (
            <div key={approval.id} className="p-4 hover:bg-neutral-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{approval.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Requester: {approval.requester}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Approver: {approval.approver}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {approval.createdAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[approval.priority]}`}>
                    {approval.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[approval.status]}`}>
                    {approval.status}
                  </span>
                  {approval.status === 'pending' && (
                    <div className="flex items-center gap-1 ml-2">
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
