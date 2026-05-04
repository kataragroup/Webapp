import React from 'react';

interface Activity {
  id: string;
  action: string;
  subject: string;
  time: string;
  status: string;
}

interface ActivityProtocolProps {
  activities: Activity[];
}

export const ActivityProtocol: React.FC<ActivityProtocolProps> = ({ activities }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-black italic uppercase underline underline-offset-8 decoration-blue-500">
        Activity Protocol
      </h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-5 bg-zinc-50 border border-zinc-100 rounded-[28px] flex items-center justify-between hover:bg-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.status === 'Success'
                    ? 'bg-emerald-500'
                    : activity.status === 'Warning'
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
              />
              <div>
                <p className="text-sm font-black italic uppercase italic">{activity.action}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {activity.subject}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black text-zinc-300 uppercase italic group-hover:text-zinc-500 transition-colors">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
