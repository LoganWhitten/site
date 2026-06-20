import React from 'react';
import { Dexie, type EntityTable } from 'dexie';

// Typing for your entities (hint is to move this to its own module)
export interface Punch {
  id: number;
  jobNumber?: string;
  startTime: number;
  endTime?: number;
  punchType: string;
}

// Database declaration (move this to its own module also)
export const db = new Dexie('PunchDatabase') as Dexie & {
  punches: EntityTable<Punch, 'id'>;
};
db.version(2).stores({
  punches: '++id, startTime',
});

export function clearDB() {
  db.punches.where("id").notEqual("s").delete()
}