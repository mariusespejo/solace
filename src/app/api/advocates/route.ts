import { getAdvocates } from './advocates.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const advocates = await getAdvocates({
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('pageSize')) || 10,
    searchTerm: searchParams.get('search') || '',
    specialtyIds: searchParams.getAll('specialties').map((id) => parseInt(id)),
    yoeGte: Number(searchParams.get('yoeGte')) || undefined
  });

  return Response.json({ advocates });
}
