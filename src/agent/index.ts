import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import { crawlQueue, extractQueue, normalizeQueue, signalsQueue, notifyQueue } from './queues'
import { prisma } from '../lib/db'
import { crawlOnondaga } from '../connectors/cott/onondaga'

const connection = new IORedis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

const RATE = Number(process.env.CRAWL_RATE_LIMIT_PER_MIN || 30)

// CRAWL
new Worker('crawl:county', async job => {
  const { county, query } = job.data as { county: string, query: string }
  if (county === 'Onondaga' && process.env.ALLOW_ONONDAGA === 'true') {
    await crawlOnondaga({ query })
  }
  await extractQueue.add('extract', { county }, { removeOnComplete: true })
}, { connection, limiter: { max: RATE, duration: 60_000 } })

// EXTRACT (stub) → In a real run, parse HTML snapshots into Deed/Mortgage rows
new Worker('extract:docs', async job => {
  // TODO: parse saved pages and upsert to Prisma
  await normalizeQueue.add('normalize', {}, { removeOnComplete: true })
}, { connection })

// NORMALIZE (stub) → Clean owner names; LLM fallback can be plugged here
new Worker('normalize:owners', async job => {
  // TODO: consolidate owners across variants
  await signalsQueue.add('signals', {}, { removeOnComplete: true })
}, { connection })

// SIGNALS (compute tenure, years since mortgage)
new Worker('signals:compute', async job => {
  // Example simple aggregation
  // In production, create SQL materialized views and refresh them here
  return
}, { connection })

// NOTIFY (summary)
new Worker('notify:summary', async job => {
  console.log('Pipeline finished for batch.')
}, { connection })

async function main() {
  console.log('Agent workers started. Queues ready.')
  if (process.argv.includes('--kick')) {
    await crawlQueue.add('crawl', { county: 'Onondaga', query: 'SMITH' })
  }
}

main().catch(err => { console.error(err); process.exit(1) })
