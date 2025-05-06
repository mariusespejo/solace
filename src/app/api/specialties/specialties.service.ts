import db from '@/db';
import { specialties } from '@/db/schema';

export const getSpecialties = async () => {
  const results = await db.select().from(specialties);

  return results;
};
