import { pool } from "@atrangi/db";
import type { SupportedEvent } from "@atrangi/types";

/**
 * Supported Event Repository - Handles all database operations for supported_events
 */
export class SupportedEventRepository {
  /**
   * Find all supported events
   * Returns all supported events ordered by event_date descending, then name
   */
  async findAll(): Promise<SupportedEvent[]> {
    const query = `
      SELECT 
        id,
        name,
        event_date,
        image_url,
        social_url
      FROM supported_events
      ORDER BY event_date DESC, name ASC
    `;

    const result = await pool.query(query);

    return result.rows.map((row) => this.mapRowToSupportedEvent(row));
  }

  /**
   * Map database row to SupportedEvent type
   */
  private mapRowToSupportedEvent(row: {
    id: string;
    name: string;
    event_date: Date;
    image_url: string | null;
    social_url: string | null;
    created_at: Date;
    updated_at: Date;
  }): SupportedEvent {
    return {
      id: row.id,
      name: row.name,
      event_date: row.event_date instanceof Date ? row.event_date.toISOString().slice(0, 10) : String(row.event_date).slice(0, 10),
      image_url: row.image_url,
      social_url: row.social_url,
    };
  }
}
