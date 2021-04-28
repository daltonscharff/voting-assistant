# Dallas County Voting Assistant

For the 2020 general election, I created this application to allow Dallas County voters to find their closest polling locations via text message. After sending a trigger word (*vote* for English or *votar* for Spanish), the bot asks for the user's ZIP code and responds with three of the closest locations along with their corresponding wait times.

Text Response in English | Text Response in Spanish
--- | ---
<img src="https://user-images.githubusercontent.com/14829777/96941115-395dd500-1497-11eb-9cb8-0f06bb98116b.jpg" width="200px"> | <img src="https://user-images.githubusercontent.com/14829777/96941117-3b279880-1497-11eb-8d9d-ab921afcad45.jpg" width="200px">

### Technologies
* Node.js with Typescript
* Express - web server
* SQLite - store location and user data
* Redis - cache calls to geocoding web service
* Twilio - send and receive text messages

## Installation
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


## Usage
```
npm run build
npm start
```

## Contributing
Contributions are welcome! I would love to expand this to multiple cities if there is interest.

## License
[GNU General Public License v3.0](https://github.com/daltonscharff/voting-assistant/blob/master/LICENSE)
