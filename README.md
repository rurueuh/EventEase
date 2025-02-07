# EventEase

This is a application for manage/subscribe to event

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/) | changed for heroui
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Firebase](https://firebase.google.com/)
- [Firestore](https://firebase.google.com/docs/firestore?hl=fr)
- [LeafletJS](https://leafletjs.com/)
- [react-hot-toast](https://react-hot-toast.com/)

## How to Use

### Install dependencies

by using `npm`

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup a firestore environement
Need to setup firestore environement like the screen I give you and add all information in .env
![image](https://github.com/user-attachments/assets/fe10b5b0-c6e2-4842-b675-7aabcc55a7f6)
Firebase rules:
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth.uid != null;
      allow read: if true;
      allow read, update, delete: if request.auth.uid == userId;
    }
    
    match /events/{eventId} {
      allow create, read, update: if request.auth.uid != null;
      
      allow read, update, delete: if request.auth.uid == resource.data.organizerId;
      
     
    }
    match /chats/{eventId} {
    	allow create: if request.auth.uid != null;
    	allow read, update, delete;
    }
  }
}
```


### Project will probably not be updated
I lost motivation about this project and for a exemple webapp it's good for me, but sadly I don't like FireBase (actually), I prefere to use self hosted mysql and create my API.
At least I tried this technologie and my base code is not in my standart so I prefer to open it (do to unkownledge about firebase and firestore) but i'm open if you want to contact and speak about it on discord (rurueuh)

### Somes screenshots
![image](https://github.com/user-attachments/assets/5241ab40-f249-46db-a839-38de14bc340d)
![image](https://github.com/user-attachments/assets/0c0a1eee-dd63-47bc-8665-b9411e0af1b1)
![image](https://github.com/user-attachments/assets/ede975ee-ee38-4388-a24f-f389bf2fb6c9)
![image](https://github.com/user-attachments/assets/3fd25137-f84f-4582-aacf-e30f8f23cfd4)
![image](https://github.com/user-attachments/assets/1a67b4db-b29a-45a5-9b41-7de318882105)

### Demo version
[EventEase](https://eventease.rurueuh.fr)


## License

Licensed under the MIT license (Non-Commercial), use it like you want but please text me if you can to make commercial usage because I want to warning you all project error i made and what you NEED to change and not blocking you ^^ by email or discord: maxjulien222@gmail.com | rurueuh
