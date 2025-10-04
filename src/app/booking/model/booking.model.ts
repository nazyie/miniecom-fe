export interface BookingMetadata {
    sessionId: string;
    facilityId: string;
    facilityName: string;
    bookingFrequency: string;
    selected: string [];
    price: number;
    noOfSlot: number;
}

export function newBookingMetadata() : BookingMetadata {
    return {
        sessionId: crypto.randomUUID(),
        facilityId: '',
        facilityName: '',
        bookingFrequency: '',
        selected: [],
        price: 0.00,
        noOfSlot: 0
    }
}