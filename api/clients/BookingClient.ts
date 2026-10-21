import { APIRequestContext, APIResponse } from "@playwright/test";
import { Booking, BookingFilters } from "../types";

export class BookingClient {
  // token is optional so negative tests can call protected endpoints without it
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  private get authHeaders(): Record<string, string> {
    return this.token ? { Cookie: `token=${this.token}` } : {};
  }

  async getIds(filters: BookingFilters = {}): Promise<APIResponse> {
    return await this.request.get("/booking", { params: filters });
  }

  async get(bookingId: number): Promise<APIResponse> {
    return await this.request.get(`/booking/${bookingId}`);
  }

  async create(booking: Booking): Promise<APIResponse> {
    return await this.request.post("/booking", { data: booking });
  }

  async update(bookingId: number, booking: Booking): Promise<APIResponse> {
    return await this.request.put(`/booking/${bookingId}`, {
      headers: this.authHeaders,
      data: booking,
    });
  }

  async partialUpdate(
    bookingId: number,
    fields: Partial<Booking>,
  ): Promise<APIResponse> {
    return await this.request.patch(`/booking/${bookingId}`, {
      headers: this.authHeaders,
      data: fields,
    });
  }

  async delete(bookingId: number): Promise<APIResponse> {
    return await this.request.delete(`/booking/${bookingId}`, {
      headers: this.authHeaders,
    });
  }
}
