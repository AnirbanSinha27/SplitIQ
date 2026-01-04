'use client';

import { useState } from 'react';
import {
  useGroups,
  useGroupBalances,
} from '@/lib/queries/group';

export default function DashboardPage() {
  const { data: groups, isLoading: groupsLoading } =
    useGroups();

  const [selectedGroupId, setSelectedGroupId] =
    useState<string | null>(null);

  const {
    data: balances,
    isLoading: balancesLoading,
  } = useGroupBalances(selectedGroupId || '');

  if (groupsLoading) {
    return <p>Loading groups...</p>;
  }

  return (
    <div className="flex gap-8 text-black">
      {/* LEFT: Group List */}
      <aside className="w-64">
        <h2 className="font-semibold mb-3">
          Your Groups
        </h2>

        <ul className="space-y-2">
          {groups?.map((group) => (
            <li
              key={group.id}
              onClick={() =>
                setSelectedGroupId(group.id)
              }
              className={`cursor-pointer border p-2 rounded ${
                selectedGroupId === group.id
                  ? 'bg-gray-200'
                  : 'bg-white'
              }`}
            >
              {group.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* RIGHT: Group Details */}
      <main className="flex-1">
        {!selectedGroupId && (
          <p className="text-gray-500">
            Select a group to view balances
          </p>
        )}

        {selectedGroupId && balancesLoading && (
          <p>Loading balances...</p>
        )}

        {balances && (
          <div>
            <h2 className="font-semibold mb-3">
              Balances
            </h2>

            <ul className="space-y-1">
              {balances.map((b) => (
                <li key={b.user_id}>
                  {b.user_id}: ₹{b.balance}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
