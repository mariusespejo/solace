import { relations, SQL, sql } from 'drizzle-orm';
import {
  index,
  customType,
  pgTable,
  integer,
  text,
  serial,
  timestamp,
  bigint,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const tsvector = customType<{
  data: string;
}>({
  dataType() {
    return `tsvector`;
  },
});

export const advocates = pgTable(
  'advocates',
  {
    id: serial('id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    city: text('city').notNull(),
    degree: text('degree').notNull(),
    yearsOfExperience: integer('years_of_experience').notNull(),
    phoneNumber: bigint('phone_number', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    search: tsvector('search')
      .notNull()
      .generatedAlwaysAs(
        (): SQL =>
          sql`setweight(to_tsvector('english', ${advocates.city}), 'A')
        ||
        setweight(to_tsvector('english', ${advocates.lastName}), 'B')
        ||
        setweight(to_tsvector('english', ${advocates.firstName}), 'C')
        ||
        setweight(to_tsvector('english', ${advocates.degree}), 'D')`
      ),
  },
  (t) => [
    index('idx_yoe').on(t.yearsOfExperience),
    index('idx_search').using('gin', t.search),
  ]
);

export const specialties = pgTable('specialties', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const advocatesToSpecialities = pgTable(
  'advocates_to_specialities',
  {
    advocateId: integer('advocate_id')
      .notNull()
      .references(() => advocates.id),
    specialtyId: integer('specialty_id')
      .notNull()
      .references(() => specialties.id),
  },
  (t) => [
		primaryKey({ columns: [t.advocateId, t.specialtyId] })
	],
);

