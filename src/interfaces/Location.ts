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
    waitTime?: number;
    isEarlyVotingLocation?: boolean;
    isVotingDayLocation?: boolean;
}

export { Location as default };