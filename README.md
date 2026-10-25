# Local Brand Matchmaker Dashboard

A clean, easy-to-use web dashboard built to help local small businesses connect with neighborhood content creators. This project was built step-by-step to demonstrate clean code, automated testing, and full-stack data persistence.

---

## Live Deployment Link
- **Live Application URL:** [https://morrismakau-prog.github.io/local-brand-matchmaker/]

---

## Project Objectives & Overview
This platform solves a real-world problem for local marketing. Small businesses often struggle to find relevant local influencers, and creators struggle to find nearby sponsors. This app bridges that gap by instantly calculating proximity and industry alignment.

### Core Objectives Met:
1. **API Integration:** Connects the front-end interface smoothly to a mockup backend data store.
2. **Version Control:** Maintained an active engineering history using structured branch workflows.
3. **UI/UX Design:** Implemented a balanced split-pane user layout focusing on  3-colors which are slateblue, coral, lightseagreen.
4. **Data Persistence:** Built persistent network routines to ensure data changes survive full browser reloads.

---

## Technologies Used
- HTML
- CSS
- JavaScript
- JSON Server
- Jest

---

##  API Endpoints & REST 
Our backend server runs locally on port `3000` (`http://localhost:3000`) and serves two persistent tables:

- **`GET /brands`**: Reads the full array of registered local business profiles.
- **`POST /brands`**: Securely appends a brand-new campaign profile to storage permanently using unique timestamp keys to protect against duplicate ID collisions.
- **`GET /creators`**: Reads the full registry of neighborhood content creators.

## Testing and Code Coverage 
 Used automated Jest unit tests to verify matchmaking engine filtering logic (`src/matchEngine.js`). The suite checks that creators are correctly matched only if they share the exact industry niche AND sit safely within a local mathematical threshold of `0.05` unit.

## Setup and Installation Instructions
1. **Install Dependencies:** In terminal window, type `npm install` to download Jest and JSON Server.
2. **Start the Database Server:** Run the command `npx json-server ./db.json` in terminal to turn on the backend data stream. Leave this terminal window running in the background.
3. Launch the Website


##  Open-Source License
This project is licensed under the standard **MIT License** 
