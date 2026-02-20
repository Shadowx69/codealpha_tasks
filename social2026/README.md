# Modern Social Media Platform (2026 Stack)

A multi-page social media platform built with the latest 2026 stable technologies.

## Tech Stack
-   **Backend:** Node.js (v24+ LTS) using Express v5.x
-   **Database:** MySQL
-   **Authentication:** Session-based via `express-session` & `express-mysql-session`
-   **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS v4 (CDN)

## Features
-   **Authentication:** Secure registration and login flow (no hashing for demonstration). Protects internal API routes.
-   **Social Feed:** Global feed for viewing posts, comments, and tracking live comment/like counts.
-   **Interactivity:** Users can Create Posts, Like Posts, and Comment on Posts asynchronously.
-   **User Search:** Real-time search functionality built into the navigation bar to find other active users.
-   **Profile System:** Dedicated profile pages showing a user's total follower/following counts, their authored post timeline, and a Follow/Unfollow toggle.

## Setup Instructions

1.  **Configure the Database:**
    *   Ensure MySQL is running on `localhost:3306` with user `root` and password `sql123`.
    *   Execute the SQL statements provided in `db.txt` to generate the `social_app_2026` database and schema.

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Server:**
    ```bash
    npm start
    ```

4.  **Access the Application:**
    Open your browser and navigate to `http://localhost:3000`.
