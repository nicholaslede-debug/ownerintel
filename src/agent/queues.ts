import { Queue, Worker, JobsOptions } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

export const crawlQueue = new Queue('crawl:county', { connection })
export const extractQueue = new Queue('extract:docs', { connection })
export const normalizeQueue = new Queue('normalize:owners', { connection })
export const signalsQueue = new Queue('signals:compute', { connection })
export const notifyQueue = new Queue('notify:summary', { connection })

export const defaultJobOpts: JobsOptions = {
  removeOnComplete: 1000,
  removeOnFail: 500,
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
}
