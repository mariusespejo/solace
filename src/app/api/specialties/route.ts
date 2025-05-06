import { getSpecialties } from "./specialties.service";

export async function GET(request: Request) {

  const specialties = await getSpecialties();

  return Response.json({ specialties });
}
