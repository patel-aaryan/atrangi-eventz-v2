import { SupportedEventRepository } from "@atrangi/core/repository/supported-event";
import type { SupportedEvent } from "@atrangi/types";

/**
 * Supported Event Service - Contains business logic for supported events
 */
class SupportedEventService {
  private readonly supportedEventRepository: SupportedEventRepository;

  constructor() {
    this.supportedEventRepository = new SupportedEventRepository();
  }

  /**
   * Get all supported events
   * Returns all supported events ordered by month_year descending, then name
   */
  async getAllSupportedEvents(): Promise<SupportedEvent[]> {
    return await this.supportedEventRepository.findAll();
  }
}

export const supportedEventService = new SupportedEventService();
