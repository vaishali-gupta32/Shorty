import { redisClient } from '../redis';

const STREAM_KEY = 'stream:analytics';

export interface ClickEvent {
    shortCode: string;
    ip: string;
    userAgent: string;
    referer: string;
    timestamp: string;
}

export class AnalyticsService {
    static async logClick(event: ClickEvent): Promise<void> {
        try {
            await redisClient.xAdd(STREAM_KEY, '*', {
                shortCode: event.shortCode,
                ip: event.ip,
                userAgent: event.userAgent,
                referer: event.referer,
                timestamp: event.timestamp
            });
        } catch (error) {
            console.error('Failed to log click event:', error);
            // Fail open: don't block redirect if analytics fails
        }
    }

    static async getAnalytics(shortCode: string): Promise<any[]> {
        // In a real app, you might aggregate this or have a separate analytics DB
        // For now, we query the raw analytics table
        // We might also want to query recent items from Redis Stream if we wanted real-time,
        // but let's stick to the persistent DB for reliability.
        try {
            // Note: This relies on the worker having processed the events from the stream
            const res = await import('../db').then(m => m.db.query(
                'SELECT * FROM analytics WHERE short_code = $1 ORDER BY timestamp DESC LIMIT 100',
                [shortCode]
            ));
            return res.rows;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            return [];
        }
    }
}
