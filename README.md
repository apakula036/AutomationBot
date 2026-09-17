# description
Automation Bot that has a lot of functionality including making  API calls to do things like send random pictures of dogs, random pictures of cats, taco recipes, and information from NASA. The bot uses Axios for the API calls and the Discord.js node module to interact with Discord.

# instructions
1. Clone the repo.
2. Install/verify that you have nodejs https://nodejs.org/en or node -v.
3. Navigate to the folder that the project is in in a terminal session "cd \DiscordBot\".
4. Use the code "npm install" to install dependencies.
5. Create a .env file in the main directory.
6. Create these empty text files in the main directory: newFile2.txt ballsCounter.txt newFile2.txt testfile.txt tweetsnoids.txt notes.txt mynewfile1.txt.
7. Login to the Discord Developer Portal and create a discord app, once created, copy the Application key and paste it into the .env file with the syntax BOT_TOKEN=""
8. Install the bot into your targeted server, this site will guide through that https://discord.com/developers/applications/select/installation.
9. In your targeted server that you want the bot to be in, copy 3 channel IDs and insert them into the .env file. The format should be the same as before like this: ROCKETCHANNEL_ID="" GENERAL_ONEID="" GENERAL_TWOID="". These channel IDs will be the channels some designated commands sned their messages to.
10. Create a new API key for the NASA API and add it to the .env file with NASA_APIKEY
11. Create a new API key set for Twitter and add them to the .env file following the same format as before and name them: CONSUMER_KEYAPI, CONSUMER_KEYAPI_SECRET, ACCESS_TOKENAPI, ACCESS_TOKENAPI_SECRET.
12. Create a new API key for the Weather App following the same format as before and name it WEATHER_API_KEY. 
13. Run the bot.js file with node.js with this code: "node bot.js" either in VS or the CLI.
14. The bot should now be setup and log a ready message in the console. You can uncomment out some test messages to the channels for additional testing. For a list of what the bot can do, scroll down to the available commands section. 

# available-commands
Use the !help for all of the commands the bot can do!

---Automations---
When the bot starts, the bot checks the weather in the area and lets me know the forecast when work ends. The bot also lets me know when work starts ane begins by messaging me in the chat. The bot will also check if a sports channel is live. 

---Manual Commands---
- !tweet: Writes a tweet using the Twitter API and Discord API to the bots twitter page. 
- !rlranks: Finds a Rocket League account and using a web scraper sends the information to the channel. 
- !playRandomSound: Using FFMPEG and discord.js the bot can play sounds to the current channel that the user is in. 
- !weather: Gives the weather like temperature wind speed and more using an API request of a location that is entered by the user. 
- !coinflip: Flips a coin gives the result with pictures.
- !meow: Sends a random cat picture using an API to the channel.
- !senddog: Sends a random dog picture using an API to the channel. 
!notethis: Takes a message and saves it to seperate text file to be reviewed later. 
!prs: Plays a random sound from the list of selected sounds available. 
!advice: Using an API request gives advice to the user. 
!eightball: Ask a yes or no question and the eight ball will respond. 
!githubQR: Sends a picture of my GitHub profile to the text. 
!help: Brings up the options that the bot can do in chat.
!advice: Will send the user advice in chat reading a websites API to grab random advice. 
!nasaphoto: Sends the NASA photo of the day to the chat. 
!tweet "Your tweet here"
!readalltweets: Reads all the tweets this bot has made and sent to Twitter and sends them to chat. 
!randomTweet: This will read a random tweet made by the bot previously. 
!affirm: Reads you a random affirmation using the Affirmations API. 
!islive "streamer ID here": This will use Puppeteer to open twitch.tv and check if a creator is live. 
!givefiles: This command will give the text file that holds the notes from the !noteThis command. 
!getpokemon: This command will give the information of a Pokemon using the Pokemon API. 
!gitHubContributions: This command will open a web link of my GitHub account and use Puppeteer to scrape my page and find out how many contributions ive made.
!rocketLeagueTrackerHelp: This command will help with the other Rocket League commands like how to use them. 
!sports: This command will read the wind, temp, and realfeel of the Normal IL area and give advice on if playing sports today is a good idea. This uses the Weather API to find this data.
!temperatureSports: Like the !sports command, this command is more specific and will read the temperature of the Normal IL area and give advice on if playing sports today is a good idea. This uses the Weather API to find this data.
!randomBetween "a number here": This command is to random a number between a set range. 
!slotMachine "amount to bet": Custom slot machine that uses points earned by using other commands and given out during games. 

---Always running commnds---
Dadbot - Ever wanted a bot that whenever someone says "Im hungry" itll respond with "Hi Hungry, Im dadbot?" Look no further! 
Pingbot - Ever wanted a bot that for no reason at all whenever it detects the word ping itll respond pong? Look no further! 

# future-plans 
There are **many** possiblites with this bot. Currently, documentation needs a massive update. I plan on adding a points system to use for fun games. Document how to get this bot running automatically using a 3rd party service.
