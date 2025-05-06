import 'dotenv/config';

import { reset, seed } from 'drizzle-seed';
import * as schema from '../schema';
import db from '..';
import { specialtyValues } from './specialties';
import { count } from 'drizzle-orm';

const NUM_ADVOCATES = 100;

async function main() {
  console.log('Resetting db...');
  await reset(db, schema);
  await seed(db, schema).refine((f) => ({
    advocates: {
      count: NUM_ADVOCATES,
      columns: {
        firstName: f.firstName(),
        lastName: f.lastName(),
        city: f.city(),
        degree: f.valuesFromArray({
          values: ['MD', 'MSW', 'PhD'],
        }),
        yearsOfExperience: f.int({
          minValue: 1,
          maxValue: 20,
        }),
        phoneNumber: f.int({
          minValue: 1234567890,
          maxValue: 9999999999,
          isUnique: true,
        }),
        createdAt: f.default({ defaultValue: undefined }),
        search: f.default({ defaultValue: undefined }),
      },
    },
    specialties: {
      count: specialtyValues.length,
      columns: {
        name: f.valuesFromArray({
          isUnique: true,
          values: specialtyValues,
        }),
      },
    },
    advocatesToSpecialities: {
      count: 100,
      columns: {
        // NOTE: drizzle-seed is not smart enough to avoid duplicates on compound keys, so our seed data will be limited to a single specialty per advocate for now
        advocateId: f.int({
          minValue: 1,
          maxValue: NUM_ADVOCATES,
          isUnique: true,
        }),
      },
    },
  }));

  /** Generate an extra 1-4 specialties for each advocate */
  const specialtyRelationships = [];
  for (let i = 1; i <= NUM_ADVOCATES; i++) {
    for (let j = 1; j <= getRandomNumberInRange(1, 4); j++) {
      specialtyRelationships.push({
        advocateId: i,
        specialtyId: getRandomNumberInRange(1, 26),
      });
    }
  }

  await db
    .insert(schema.advocatesToSpecialities)
    .values(specialtyRelationships)
    .onConflictDoNothing();

  const [advocates] = await db
    .select({ count: count() })
    .from(schema.advocates);
  const [specialties] = await db
    .select({ count: count() })
    .from(schema.specialties);
  const [advocatesToSpecialities] = await db
    .select({ count: count() })
    .from(schema.advocatesToSpecialities);

  console.log(`Generated ${advocates.count} advocates, ${specialties.count} specialties, ${advocatesToSpecialities.count} advocatesToSpecialities...`);
}

function getRandomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

main()
  .then(() => {
    console.log('Successfully ran seeding.');

    process.exit(0);
  })
  .catch((e) => {
    console.error('Failed to run seeding.');
    console.error(e);

    process.exit(1);
  });
