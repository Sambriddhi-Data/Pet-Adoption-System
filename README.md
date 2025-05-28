# Pet Adoption System - FurEver Friends 🐾

**Fur-Ever Friends** is a full-stack pet adoption platform developed as a Final Year Project for the **BSc (Hons) Computer Science** program at **Herald College Kathmandu**.

Built using **Next.js (App Router)** and **TypeScript**, the system supports role-based access, secure authentication, image uploads, payments, email communication and bot protection — offering a modern and streamlined pet adoption experience.

---

## 🚀 Features

- 🔒 Google Sign-In via **Better Auth**
- 🧑‍💼 Role-based routing (admin, shelter manager, user)
- 🐶 Add/Edit pet profiles with:
  - Basic, health, and personality details
- ☁️ Image uploads with **Cloudinary** (`next-cloudinary`)
- 💳 **Khalti Payment Gateway** for donations to shelter
- 📬 Email notifications using **Nodemailer + Mailtrap** (demo)
- 🧠 **hCaptcha** integration for bot protection
- 🗂 Clean, card-based layout for forms
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** Better Auth with Google Sign-In
- **Payments:** Khalti (backend-based implementation)
- **Emails:** Nodemailer with Mailtrap (demo/testing)
- **Image Uploads:** Cloudinary
- **Bot Protection:** hCaptcha

---

## 🔐 Roles & Routing

| Role            | Redirected To         | Capabilities                                                      |
|-----------------|-----------------------|-------------------------------------------------------------------|
| Admin           | `/admin-homepage`     | Admin-level access and management                                 |
| Shelter Manager | `/shelterhomepage`    | Add, edit, manage pets                                            |
| General User    | `/`                   | Browse pets, adopt, rehome, lost pet alerts, donation via Khalti  |

---
e
## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sambriddhi-Data/Pet-Adoption-System.git
   cd fur-ever-friends
   
2. **Install dependencies:**
   ```bash
   npm install

3. **Set up environment variables:**

Create a .env file and include: 

BETTER_AUTH_SECRET = your_better_auth_secret
BETTER_AUTH_URL = your_base_url_of_the_app

DATABASE_URL=your_postgresql_database_url

EMAIL_VERIFICATION_CALLBACK_URL=your_redirection_route_after_verified_email

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@cloud_name

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

KHALTI_SECRET_KEY=your_khalti_secret_key
NEXT_PUBLIC_KHALTI_PUBLIC_KEY=your_khalti_public_key

NEXT_PUBLIC_HCAPTCHA_SITEKEY=your_hcaptcha_site_key
HCAPTCHA_SECRET=your_hcaptcha_secret_key

MAIL_HOST = sandbox.smtp.mailtrap.io
MAIL_PORT = 
MAIL_USER = 
MAIL_PASS = 

4. Push database schema
    ```bash
    npx prisma db push

5. Run the Development Server
    ```bash
    npm run dev

6. Screenshots:

<details>
  <summary>Click to expand screenshots</summary>
  
  ### User Interface
  
  #### Homepage
  ![Homepage](/public/screenshots/mainhomepage.png)
  
  #### Pet Browsing
  ![Pet Browsing](/public/screenshots/searchpets.png)
  
  ### Shelter Manager Interface
  
  #### Shelter Homepage
  ![Shelter Homepage](/public/screenshots/shelter-homepage.png)
  
  #### Add Pet Form
  ![Add Pet Form](/public/screenshots/shelter-addpet.png)
  
  #### Rehome Request View
  ![Rehome Requests Form](/public/screenshots/shelter-rehomerequests.png)

  ### Admin Interface
  
  #### Admin Homepage
  ![Admin Homepage](/public/screenshots/admin-homepage.png)

  #### Claim Lost Pets
   ![Claim Lost Pets](/public/screenshots/admin-claimlostpets.png)

</details>
