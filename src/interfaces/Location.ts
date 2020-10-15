interface Location {
    id?: number;
    name?: string;
    room?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
    waitMinutes?: number;
    isEarlyVotingLocation?: boolean;
    isVotingDayLocation?: boolean;
    referenceId?: number;
}

export { Location as default };