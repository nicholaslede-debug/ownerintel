export async function POST() {
  const rows = [
    ['Property', 'Owner', 'Units', 'YearsOwned', 'YearsSinceMortgage'],
    ['612 W Seneca Tpke Unit 14, Syracuse NY', 'Example Holdings LLC', '12', '11', '13']
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="ownerintel-export.csv"'
    }
  });
}
