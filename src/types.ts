import { InferSelectModel } from 'drizzle-orm';
import { advocates, specialties } from './db/schema';

export type AdvocateSearchParams = {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  specialtyIds?: number[];
  yoeGte?: number; // yearsOfExperience >= range queries
};

export type Specialty = InferSelectModel<typeof specialties>;

export type AdvocateDetails = InferSelectModel<typeof advocates> & {
  specialties: Specialty[];
};
