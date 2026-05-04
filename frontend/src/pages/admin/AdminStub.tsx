import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Card } from '../../components/ui/Card';

export default function AdminPageStub({ title = "Admin Module" }) {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">{title}</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">Protocol data visualization</p>
        </div>
        <Card className="flex flex-col items-center justify-center p-20 border-dashed">
           <p className="text-gray-600 font-bold italic">Command unit: Module active, data synchronizing...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
