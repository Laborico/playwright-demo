export type BookingDates = {
  checkin: string;
  checkout: string;
};

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
};

export type BookingFilters = Partial<{
  firstname: string;
  lastname: string;
  checkin: string;
  checkout: string;
}>;
