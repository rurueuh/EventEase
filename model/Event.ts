import User from "./Users";

export default interface Event {
    attendees: User[];
    date: string;
    description: string;
    location: string;
    organizer: string;
    organizerId: string;
    time: string;
    title: string;
}