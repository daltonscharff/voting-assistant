# Dallas County Voting Assistant

For the 2020 general election, I created this application to allow Dallas County voters to easily find their closest polling locations and assess the wait times, where available, via text message. Responses were in either English or Spanish depending on the user's trigger word (*vote* or *votar*).

### Examples
<figure style="display: inline-block">
    <img src="https://user-images.githubusercontent.com/14829777/96941115-395dd500-1497-11eb-9cb8-0f06bb98116b.jpg" width="200px">
    <figcaption>Text Response in English</figcaption>
</figure>
<figure style="display: inline-block">
    <img src="https://user-images.githubusercontent.com/14829777/96941117-3b279880-1497-11eb-8d9d-ab921afcad45.jpg" width="200px">
    <figcaption>Text Response in Spanish</figcaption>
</figure>

### Technologies
* Node.js with Typescript
* Express - web server
* SQLite - store location and user data
* Redis - cache calls to geocoding web service
* Twilio - send and receive text messages

### Setup
1. Install Node.js >= 12, SQLite, and Redis

2. After cloning the repository, create a file called .env 

```
# .env

# should early voting and/or voting day locations be returned
INCLUDE_EARLY_VOTING_LOCATIONS=true
INCLUDE_VOTING_DAY_LOCATIONS=false

# redis settings
REDIS_HOST= 
REDIS_PORT=

# rapid API key for geocoding API
RAPID_API_KEY=

# twilio account SID, authorization token, and telephone number used to send and receive text messages
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_NUMBER=
```

3. Install dependencies and run the application to create sqlite database
```
npm i
npm run dev
```

4. Once the console displays "Connected to database", stop the application

5. Connect to the SQLite database located in data/db.sqlite and run all queries found in sql/locations.sql and sql/users.sql

6. Run the application
```
npm run build
npm start
```