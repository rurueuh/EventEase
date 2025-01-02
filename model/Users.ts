interface User {
  username: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;

  location?: string;
  job?: string;
  description?: string;

  aboutPhone?: string;
  aboutLocationAddress?: string;
  aboutEmail?: string;
  aboutWebsite?: string;

  basicInfoBirthDate?: string;
  basicInfoGender?: string;
  basicInfoRelationshipStatus?: string;

  profilePicture?: string;
}

export default User;
