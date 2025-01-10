import { DocumentReference } from "firebase/firestore";

export default interface Event {
  attendees: DocumentReference[];
  date: string;
  description: string;
  location: string;
  organizer: string;
  lat: number;
  lng: number;
  organizerId: string;
  time: string;
  title: string;
  image?: string;
}
