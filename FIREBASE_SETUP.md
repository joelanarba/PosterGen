# Firebase Setup Guide

Follow these steps to create your Firebase project and get the configuration keys.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `postergen` (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional for now)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

## Step 2: Enable Authentication

1. In the Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on **"Email/Password"** under Sign-in providers
4. Enable **"Email/Password"**
5. Click **Save**
6. Click on **"Google"** under Sign-in providers
7. Enable **Google** sign-in
8. Enter your support email
9. Click **Save**

## Step 3: Create Firestore Database

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose your database location (e.g., `us-central1`)
5. Click **Enable**

## Step 4: Enable Firebase Storage

1. Click **"Storage"** in the left sidebar
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Click **Next**
5. Choose storage location (same as Firestore)
6. Click **Done**

## Step 5: Get Client Configuration

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. Enter app nickname: `PosterGen Web`
6. Check **"Also set up Firebase Hosting"** (optional)
7. Click **"Register app"**
8. Copy the `firebaseConfig` object (you'll need these values)

## Step 6: Get Admin SDK Configuration

1. Still in **Project Settings**, click the **"Service accounts"** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** - a JSON file will download
4. Open the downloaded JSON file
5. You'll need these values:
   - `project_id`
   - `client_email`
   - `private_key`

## Step 7: Provide Configuration to Me

Once you have all the configuration values, I'll need:

### From Web App Config (Step 5):
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

### From Service Account JSON (Step 6):
- `project_id`
- `client_email`
- `private_key`

**Important**: Keep the private key secure! Don't share it publicly.

---

## Ready?

Once you have these values, share them with me and I'll:
1. Create the `.env.local` file with your configuration
2. Complete the Firebase implementation
3. Test the authentication flow

**Note**: You can paste the values directly - I'll format them correctly for the environment file.
