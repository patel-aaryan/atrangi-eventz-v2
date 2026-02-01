import { SponsorRepository } from "@atrangi/core/repository/sponsor";
import type { Sponsor } from "@atrangi/types";

/**
 * Sponsor Service - Contains business logic for sponsors
 */
class SponsorService {
  private readonly sponsorRepository: SponsorRepository;

  constructor() {
    this.sponsorRepository = new SponsorRepository();
  }

  /**
   * Get all sponsors
   * Returns all sponsors ordered by company name
   */
  async getAllSponsors(): Promise<Sponsor[]> {
    return await this.sponsorRepository.findAll();
  }
}

export const sponsorService = new SponsorService();
