import { pool } from "@atrangi/db";
import type { Sponsor } from "@atrangi/types";

/**
 * Sponsor Repository - Handles all database operations for sponsors
 */
export class SponsorRepository {
  /**
   * Find all sponsors
   * Returns all sponsors ordered by company name
   */
  async findAll(): Promise<Sponsor[]> {
    const query = `
      SELECT 
        id,
        company_name,
        website_url,
        image_url,
      FROM sponsors
      ORDER BY company_name ASC
    `;

    const result = await pool.query(query);

    return result.rows.map((row) => this.mapRowToSponsor(row));
  }

  /**
   * Map database row to Sponsor type
   */
  private mapRowToSponsor(row: any): Sponsor {
    return {
      id: row.id,
      company_name: row.company_name,
      website_url: row.website_url,
      image_url: row.image_url,
    };
  }
}
