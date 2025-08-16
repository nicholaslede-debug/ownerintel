/**
 * Onondaga County Cott eSearch connector (guest index).
 * This skeleton logs in as guest (if permitted), navigates to Name Search, and
 * outlines where to parse deed/mortgage index rows. Respect TOS/robots. Do not
 * fetch document images without appropriate access.
 */
import { chromium } from 'playwright'
import { prisma } from '../../lib/db'

export async function crawlOnondaga(params: { query: string }) {
  if (process.env.ALLOW_ONONDAGA !== 'true') {
    console.log('Onondaga crawl disabled. Set ALLOW_ONONDAGA=true to enable.')
    return
  }

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  // Navigate to login
  await page.goto('https://cotthosting.com/NYOnondagaExternal/User/Login.aspx', { waitUntil: 'domcontentloaded' })

  // Try to click the guest login button if present
  const guest = page.getByRole('button', { name: /guest/i })
  if (await guest.isVisible()) {
    await guest.click()
  }

  // TODO: navigate to Name Search, enter query (e.g., 'SMITH'), paginate results
  // Example placeholders:
  // await page.fill('#LastName', params.query)
  // await page.click('#Search')

  // For each result row, extract fields and upsert to Prisma:
  // await prisma.deed.create({...}) or prisma.mortgage.create({...})

  await browser.close()
}

// Allow running directly from CLI: `npm run job:crawl:onondaga -- "SMITH"`
if (require.main === module) {
  const q = process.argv.slice(2).join(' ').trim() || 'SMITH'
  crawlOnondaga({ query: q }).then(() => {
    console.log('Finished Onondaga crawl (skeleton).')
  })
}
