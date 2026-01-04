'use client';

import { useState } from 'react';
import { useCreateGroup } from '@/lib/queries/group';

export default function CreateGroupModal() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateGroup();

  function handleCreate() {
    if (!name.trim()) return;

    mutate(name, {
      onSuccess: () => {
        setName('');
        setOpen(false);
      },
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border px-3 py-1 rounded"
      >
        + Create Group
      </button>
    );
  }

  return (
    <div className="border p-4 rounded bg-white space-y-3">
      <h3 className="font-semibold">Create Group</h3>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Group name"
        className="border p-2 w-full rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          disabled={isPending}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Create
        </button>
        <button
          onClick={() => setOpen(false)}
          className="border px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
