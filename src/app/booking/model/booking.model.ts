export interface BookingMetadata {
    sessionId: string;
    facilityId: string;
    facilityName: string;
    bookingFrequency: string;
    date?: string | null;
    selected: any [];
    price: number;
    noOfSlot: number;
    openingTime: string;
    closingTime: string;
}

export function newBookingMetadata() : BookingMetadata {
    return {
        sessionId: crypto.randomUUID(),
        facilityId: '',
        facilityName: '',
        bookingFrequency: '',
        date: null,
        selected: [],
        price: 0.00,
        noOfSlot: 0,
        openingTime: '',
        closingTime: '',
    }
}