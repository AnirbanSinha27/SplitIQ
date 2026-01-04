'use client';

import { useGroups } from '@/lib/queries/group';

export default function GroupList({
  selectedGroupId,
  onSelect,
}: {
  selectedGroupId: string | null;
  onSelect: (id: string) => void;
}) {
  const { data: groups, isLoading } = useGroups();

  if (isLoading) return <p>Loading groups...</p>;

  return (
    <ul className="space-y-2">
      {groups?.map(group => (
        <li
          key={group.id}
          onClick={() => onSelect(group.id)}
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
  );
}
