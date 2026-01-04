'use client';

import { useState } from 'react';
import { useInviteMember } from '@/lib/queries/group';

export default function InviteMemberForm({
  groupId,
}: {
  groupId: string;
}) {
  const [email, setEmail] = useState('');
  const { mutate, isPending } = useInviteMember(groupId);

  function handleInvite() {
    if (!email.trim()) return;

    mutate(email, {
      onSuccess: () => {
        setEmail('');
        alert('Member invited');
      },
    });
  }

  return (
    <div className="border p-3 rounded bg-white space-y-2">
      <h3 className="font-semibold text-sm">
        Invite Member
      </h3>

      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full rounded"
      />

      <button
        onClick={handleInvite}
        disabled={isPending}
        className="bg-black text-white px-3 py-1 rounded w-full"
      >
        Invite
      </button>
    </div>
  );
}
