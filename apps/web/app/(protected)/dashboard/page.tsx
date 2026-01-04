'use client';

import { useState } from 'react';
import GroupList from './GroupList';
import CreateGroupModal from './CreateGroupModal';
import InviteMemberForm from './InviteMemberForm';
import { useGroupBalances } from '@/lib/queries/group';

export default function DashboardPage() {
  const [selectedGroupId, setSelectedGroupId] =
    useState<string | null>(null);

  const { data: balances, isLoading } =
    useGroupBalances(selectedGroupId || '');

  return (
    <div className="flex gap-8 text-black">
      {/* LEFT */}
      <aside className="w-64 space-y-4">
        <CreateGroupModal />
        <GroupList
          selectedGroupId={selectedGroupId}
          onSelect={setSelectedGroupId}
        />
      </aside>

      {/* RIGHT */}
      <main className="flex-1 space-y-4">
        {!selectedGroupId && (
          <p>Select a group</p>
        )}

        {selectedGroupId && isLoading && (
          <p>Loading balances...</p>
        )}

        {selectedGroupId && balances && (
          <>
            <h2 className="font-semibold">Balances</h2>
            <ul>
              {balances.map(b => (
                <li key={b.user_id}>
                  {b.user_id}: ₹{b.balance}
                </li>
              ))}
            </ul>

            <InviteMemberForm
              groupId={selectedGroupId}
            />
          </>
        )}
      </main>
    </div>
  );
}
