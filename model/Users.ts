
interface About {
    phone?: string;
    locationAddress?: string;
    email?: string;
    website: string;
}

interface BasicInfo {
    birthDate: Date;
    gender: string;
    relationshipStatus: string;
}

interface User {
    username: string;
    email: string;
    age: number;
    createdAt: Date;
    location?: string;
    job?: string;
    description?: string;
    aboutPhone?: string;
    aboutLocationAddress?: string;
    aboutEmail?: string;
    aboutWebsite: string;
    basicInfo: BasicInfo;
    profilePicture?: string;
}

export default User;
