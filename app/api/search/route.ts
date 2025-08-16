import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const minUnits = Number(searchParams.get('minUnits') ?? '5');

  // TODO: Replace with Prisma query. This is a mocked response for first run.
  const demo = [
    {
      id: 'demo1',
      situsAddress: '612 W Seneca Tpke Unit 14',
      city: 'Syracuse',
      ownerName: 'Example Holdings LLC',
      units: 12,
      yearsOwned: 11,
      yearsSinceMortgage: 13,
    },
  ].filter(r => r.units >= minUnits);

  return Response.json({ results: demo });
}
