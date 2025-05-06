import { AdvocateDetails, AdvocateSearchParams } from '@/types';
import db from '../../../db';
import {
  advocates,
  advocatesToSpecialities,
  specialties,
} from '../../../db/schema';
import { and, asc, eq, gte, inArray, InferSelectModel, sql } from 'drizzle-orm';

const MAX_PAGE_SIZE = 100;

export const getAdvocates = async ({
  page = 1,
  pageSize = 10,
  searchTerm,
  specialtyIds,
  yoeGte,
}: AdvocateSearchParams) => {
  const where = [];

  if (specialtyIds?.length) {
    const specializers = await getAdvocateIdsSpecializingIn(specialtyIds);

    where.push(inArray(advocates.id, specializers));
  }

  if (searchTerm) {
    /**
     * we convert "hello world" --> "hello & world"
     * so that FTS understands we're looking to match every token
     */
    const query = searchTerm.split(' ').join('&') + ':*'; // assume last word might not be complete as user is typing, so we add a wildcard
    where.push(sql`${advocates.search} @@ to_tsquery('english', ${query})`);
  }

  if (yoeGte) {
    where.push(gte(advocates.yearsOfExperience, yoeGte));
  }

  const searchResults = (await db
    .select()
    .from(advocates)
    .where(and(...where))
    .orderBy(asc(advocates.firstName))
    .limit(Math.min(pageSize, MAX_PAGE_SIZE))
    .offset((page - 1) * pageSize)) as AdvocateDetails[];

  for (let advocate of searchResults) {
    /** we can also lookup all relationships at once, but wanted to keep it simple for now */
    advocate.specialties = await getAdvocateSpecialties(advocate.id);
  }

  return searchResults;
};

const getAdvocateIdsSpecializingIn = async (specialtyIds: number[]) => {
  const specializers = await db
    .select()
    .from(advocatesToSpecialities)
    .where(inArray(advocatesToSpecialities.specialtyId, specialtyIds));

  return specializers.map((row) => row.advocateId);
};

const getAdvocateSpecialties = async (advocateId: number) => {
  const results = await db
    .select()
    .from(advocatesToSpecialities)
    .leftJoin(
      specialties,
      eq(advocatesToSpecialities.specialtyId, specialties.id)
    )
    .where(eq(advocatesToSpecialities.advocateId, advocateId));

  return results.map((r) => r.specialties!);
};
