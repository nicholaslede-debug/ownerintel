import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const owner = await db.owner.create({
    data: {
      type: 'ENTITY',
      name: 'Example Holdings LLC',
      mailingAddr1: 'PO Box 123',
      mailingCity: 'Syracuse',
      mailingState: 'NY',
      mailingZip: '13202',
    }
  })

  const prop = await db.property.create({
    data: {
      situsAddress: '612 W Seneca Tpke Unit 14',
      city: 'Syracuse',
      state: 'NY',
      postalCode: '13207',
      county: 'Onondaga',
      propertyType: 'MF 5+',
      units: 12,
    }
  })

  await db.ownerProperty.create({
    data: { ownerId: owner.id, propertyId: prop.id, role: 'OWNER' }
  })

  await db.deed.create({
    data: { propertyId: prop.id, recordedDate: new Date('2012-06-30'), docType: 'WARRANTY', grantee: owner.name }
  })

  await db.mortgage.create({
    data: { propertyId: prop.id, recordedDate: new Date('2011-07-01'), amount: 350000 as any, lender: 'Sample Bank' }
  })
}

main().finally(() => db.$disconnect())
