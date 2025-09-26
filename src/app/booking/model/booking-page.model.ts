export interface RequestTemporaryBooking {
    sessionId: string;
    facilityId: string;
    bookingDate: RequestTemporaryBookingDate[];
}

export interface RequestTemporaryBookingDate {
    date: string;
    startTime: string;
    endTime: string;
}

export interface RequestBookedFacility {
    sessionId: string;
    startDate: string;
    endDate: string;
}

export interface ResponseShopDetail {
    shopName: string;
}

export interface ResponseBookedFacility {
    isBookingConfirm: boolean;
    date: string;
    startTime: string;
    endTime: string;
}

export interface ResponseFacility {
    facilityId: string;
    facilityName: string;
    facilityType: string;
    itemDescription: string;
    facilitySlug: string;
    bookingFrequency: string;
    price: number;

    openingTime: string;
    closingTime: string;
    mondaySlot: boolean;
    tuesdaySlot: boolean;
    wednesdaySlot: boolean;
    thursdaySlot: boolean;
    fridaySlot: boolean;
    saturdaySlot: boolean;
    sundaySlot: boolean;
}