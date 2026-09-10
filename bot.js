require("dotenv").config();

var fs = require('fs');
const puppeteer = require('puppeteer');
//const Discord = require('discord.js');
//const client = new Discord.Client();
const axios = require('axios');
const date = new Date();
const queue = new Map();
//const ffmpeg = require("ffmpeg");
const channelTwoID = process.env.GENERAL_TWOID;
const channelOneID = process.env.GENERAL_ONEID;
const channelRocketLeague = process.env.ROCKETCHANNEL_ID;
const weatherAPPKey = process.env.WEATHER_API_KEY;
const yttl = require('ytdl-core');
const YTSearcher = require('ytsearcher');
const prefix = "!";
const ffmpegStatic = require('ffmpeg-static');
console.log("constants are ready");
//Twitter API Stuff
/* Twitter stuff turned off 2/11/2025 for repair 
var Twit = require('twit');
const { title } = require("process");
var T = new Twit({
  consumer_key:         process.env.CONSUMER_KEYAPI,
  consumer_secret:      process.env.CONSUMER_KEYAPI_SECRET,
  access_token:         process.env.ACCESS_TOKENAPI,
  access_token_secret:  process.env.ACCESS_TOKENAPI_SECRET,
})
*/
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
console.log("first constnat ");
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus 
} = require('@discordjs/voice');
const path = require('path');

// Initialize the Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates // Required to interact with voice channels
    ]
});

const eightBallArray = [
    "As I see it, yes.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "It is certain.",
    "It is decidedly so.",
    "Most likely.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Outlook good.",
    "Reply hazy, try again.",
    "Signs point to yes.",
    "Very doubtful.",
    "Without a doubt.",
    "Yes.",
    "Yes – definitely.",
    "You may rely on it.",
    "Eat my shorts."
];
const soundArray = [
    "sounds/balls.mp3",
    "sounds/chunky.mp3",
    "sounds/grimreaper.mp3",
    "sounds/rain.mp3",
    "sounds/graduation.mp4",
    "sounds/kingdomHearts.mp3",
    "sounds/MTEdenDubstep.mp3",
];
var i;
//Start bot and run these functions
client.once('ready', () => {
    //client.channels.cache.get(channelTwoID).send('Im Ready!');
    console.log("Bot is started and ready to serve!");
    //checkTimeFunc();
    //greetings();
    //autoCheckRocketLeague();
});


//Giant if else statement taking message from user and breaking it down to do the correct function also tests if the sender is a bot, if so, do nothing.
client.on('messageCreate', (message) => {
    //console.log("message:", message.author, message.content );
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    if (message.content === "!help") {
        message.reply('I can do a bunch of things including play sounds! Here is a list of what I can do: ')
        message.reply('!playRandomSound, !githubQR, !islive "streamer ID here", !giveFiles, !getPokemon, !gitHubContributions, !noteThis "your note here", !rlranks "your steam ID here", !rocketLeagueTrackerHelp, !advice, !tweet "Your tweet here", !readAllTweets, !randomTweet, !rain, !senddog, !eightball, !temperatureSports, !weather "a city here", !coinFlip, !meow, !randomBetween "a number here", !balls, !affirm, and !sports'); message.react("👍");
    } else if (theCommand === "!advice") {
        giveAdvice(message); 
    } else if ((message.content.startsWith("!notethis")) || (message.content.startsWith("!note")) || (message.content.startsWith("!addnote")) || (message.content.startsWith("!idea"))) {
        getReadyToSaveToTextFile(message);
    } else if (theCommand == "!balls") {
        playSong("sounds/balls.mp3", message)
        ballsCounter()
    }else if ((theCommand == "!ballchecker") || (theCommand == "!ballschecker") || (theCommand == "!checkballscounter")) {
        ballChecker(message)
    } else if (theCommand == "!chunky") {
        playSong("sounds/chunky.mp3", message)
    } else if (theCommand == "!grimreaper") {
        playSong("sounds/grimreaper.mp3", message)
    } else if (theCommand == "!rain") {
        playSong("sounds/rain.mp3", message)
    } else if ((theCommand == "!playrandomsound") || (theCommand == "!prs"))  {
        playRandom(message)
    } else if ((theCommand == "!stop") || (theCommand == "!disconnect") || (theCommand == "!leave")){
        disconnectBot(message)
    } else if (message.content.startsWith("!weather")){
        giveWeather(message)
    } else if (theCommand === "!randomnote"){
        randomNote(message);
    } else if (theCommand == "!readallnotes"){
        readAllNotes(message);
    } else if(theCommand === "!sports"){
        weatherSports(message)
    } else if(theCommand === "!temperaturesports"){
        temperatureSports(message)
    } else if ((theCommand === "!coinflip") || (theCommand == "!flipacoin") || (theCommand == "!flipcoin")) {
        flipACoin(message)
    } else if (theCommand === "!eightball") {
        eightBall(message)
    } else if (theCommand === "!meow") {
        message.channel.send("meow" + randomCat(message))
    } else if(theCommand === "!getcat") {
        message.reply(getCat())
    } else if (theCommand === "!senddog") {
        message.channel.send("Doggo" + randomDog(message))
    } else if (message.content.startsWith("!randombetween")){
        randomBetween(message)
    } else if(message.content.startsWith("!tweet")){
        getReadyForTweet(message)
    } else if (theCommand == "!readalltweets"){
        readAllTweets();
    } else if (theCommand == "!randomtweet"){
        readRandomTweet();
    } else if(theCommand === "!rlbeef3s"){
        message.reply("Working on it! Please wait a second, theres a bit going on behind the scenes because RL doesnt want to make this easy!")
        scrapeText('https://rocketleague.tracker.network/rocket-league/profile/steam/76561198010412811/overview', '//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[4]/td[2]/div[2]', message)
    } else if(message.content.startsWith("!rlranks")){
        rlScrapeFunction(message)
    } else if (theCommand == "!rocketleaguetrackerhelp") {
        message.reply("Hello! To use the tracker you'll need to do a couple things first. Sign in with your steam account to link it to the tracker here: https://rocketleague.tracker.network/")
        message.reply("After you have connected your account, give it some games, time, and refresh a few times so that the data is correct and current. After that you should be good to go! Use the command !rl3s 'your steam ID here' to get your rank! Because RocketLeague wants to make it harder still, the tracker seems to flip flop the data so I have to grab your hoops rank as well, oh well lol! \nFor a bonus tip go to your Steam profile and change the URL to a custom one thats easier to remember rather than a bunch of numbers. Thank you Trevor!!")
    } else if (theCommand == "!githubcontributions"){
        message.reply("Working on it!")
        scrapeGithub(message, 'https://github.com/apakula036') 
    } else if (theCommand == "!givefiles"){
        giveTextFile(message);
    } else if (message.content.startsWith("!islive")){
        message.reply("Working on it! One second...")
        scrapeTwitch(message)
    } else if (theCommand == "!affirm"){
        affirmationAPICall(message);
    } else if ((theCommand == "!nasaphoto") || (theCommand == "!nasaphotodaily") || (theCommand == "!nasaphotoday") || (theCommand == "!nasa")) {
        nasaPhoto(message);
    } else if ((theCommand == "!githubqr") || (theCommand == "!githubqrcode") || (theCommand == "!githubcode") || (theCommand == "!qrcode")) {
        githubQR(message);
    } else if (message.content.startsWith("!getPokemon")){
        getPokemon(message)
    } else if (theCommand == "!mteden") {
        playSong("sounds/MTEdenDubstep.mp3", message)
    } else if (theCommand == "!kingdomhearts") {
        playSong("sounds/kingdomhearts.mp3", message)
    } else if (theCommand == "!graduation") {
        playSong("sounds/graduation.mp4", message)
    }
});
//Dad bot functionality here seperate can probably get rid of these needs test 
client.on('messageCreate', (message) => {
    if ((message.content.startsWith("I'm")) || (message.content.startsWith("Im")) || (message.content.startsWith("I’m")) || (message.content.startsWith("im")) || (message.content.startsWith("i'm"))){
        dadBot(message)
    }
});
client.on('messageCreate', (message) => {
    if ((message.content.startsWith("ping")) || (message.content.startsWith("Ping")) || (message.content.startsWith("PING")) || (message.content.toLowerCase().includes("ping"))){
        pingBot(message)
    }
});
//---------------------Functions---------------------------------------------------------------------------------------------
function playRandom(message){
    const randomNumber = Math.floor(Math.random()* soundArray.length);
    playSong(soundArray[randomNumber], message)
}
/* Deprecated 9/9/2026, not needed anymore, not enough short sounds to make this worth it, can be added back in if more short sounds are added
function playRandomShort(message){
    const randomNumber = Math.floor(Math.random()* soundArray.length);
    playSong(shortSoundArray[randomNumber], message)
}*/
function eightBall(message){
    const randomNumber = Math.floor(Math.random()* eightBallArray.length);
    message.reply(eightBallArray[randomNumber])
    message.react("🎱")
}
//const connection = message.channel.join()
// TypeError: connection.playFile is not a function
//const dispatcher = connection.playFile('./music.mp3')

//const dispatcher2 = connection.play('./music.mp3')

function playSong(songName, message){
    console.log("Song name: ", songName);
    //console.log(message)
    //console.log(message.guild);
    //console.log(message.guild.me);
    //console.log(message.guild.me.voice);
    //console.log(message.guild.me.voice.channel);
    
    if (!message.member.voice.channel) 
        return message.reply("You must be in a voice channel.");
    
    //if (message.guild.me.voice.channel) 
    //    return message.reply("I'm already playing.");
    
    const voiceChannel = message.member.voice.channel;
    
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false
    });
    
    const player = createAudioPlayer();
    const resource = createAudioResource(songName);
    
    player.play(resource);
    connection.subscribe(player);
    
    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
    });
    
    player.on('error', error => {
        console.error('Player error:', error);
    });
    
    message.reply("Playing...");
};

function dadBot(message){
    const args = message.content.slice().trim().split(/ +/g);
        const theCommand = args.shift();
        var stringer = "";
        for(i = 0; i < args.length; i++){
            stringer = stringer + " " + args[i];
        }
        message.channel.send("Hi" + stringer + ", im HelpfulBot")
        addToTextFile(message);
        return;
}
function pingBot(message){
    message.reply("PONG")
    message.react("🏓")
    addToTextFile(message);
    return;
}
function temperatureSports(message){
    axios.get("http://api.openweathermap.org/data/2.5/weather?q=normal,us&units=imperial&APPID=" + weatherAPPKey)
        .then((res) => {  
            if(res.data.main.temp <= 45){
                message.reply("The temperature outside is " + res.data.main.temp + ", its pretty cold out I would stay in today and play some games");
            } else if(res.data.main.temp <=55 ){
                message.reply("The temperature outside is " + res.data.main.temp + ", its not the warmest out right now.");
            } else if(res.data.main.temp <= 60  ){
                message.reply("The temperature outside is " + res.data.main.temp + ", its a little chilly, bring a sweater!");
            } else if(res.data.main.temp <= 70){
                message.reply("The temperature outside is " + res.data.main.temp + ", its warm, get out there!");
            } else if(res.data.main.temp == 75){
                message.reply("The temperature outside is " + res.data.main.temp + ", its perfect!!!");
            } else {
                message.reply("The temperature outside is " + res.data.main.temp + ", its pretty hot out, get out there! ")}
        })
        .catch((err) => {
            console.error('ERR:', err)
        })
}
function flipACoin(message){
    const randomNumber = Math.floor(Math.random() * 2);
    const heads = new AttachmentBuilder('./coinImages/coin_Heads.jpg');
    if(randomNumber == 1){
        message.channel.send({ 
            content: 'heads!', 
            files: [heads] 
        });
    } else {
        const tails = new AttachmentBuilder('./coinImages/coin_tails.jpg');
        console.log(tails.attachment);
        message.channel.send({ 
            content: 'Tails!', 
            files: [tails] 
        });
    }
}
function giveTextFile(message){
    const textFile = new AttachmentBuilder('./testfile.txt');
    message.channel.send({ 
        content: "Here is the text file you requested, it has all of the notes that have been saved to the bot so far. If you want to add more notes, use the command !noteThis 'your note here' and it will be added to the file. If you want to see a random note, use the command !randomNote and it will give you one of the notes from the file.", 
        files: [textFile] 
    });
}
function weatherSports(message){
    axios.get("http://api.openweathermap.org/data/2.5/weather?q=normal,us&units=imperial&APPID=" + weatherAPPKey)
    .then((res) => {  
        if(res.data.wind.speed <= 3){
            message.reply("The wind today is almost nonexistant go outside! The temperature is " + res.data.main.temp + " degrees. The real feel is "
            + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Tennis would be great today!");
        } else if(res.data.wind.speed <=6 ){
            message.reply("The wind today is pretty slim get out there! The temperature is " + res.data.main.temp + " degrees. The real feel is "
            + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Tennis would be pretty good today!");
        } else if(res.data.wind.speed <= 9.5  ){
            message.reply("The wind today isnt looking bad, check the forecast for gusts and future developments could be great! The temperature is " + res.data.main.temp + " degrees. The real feel is "
            + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Disc golf is going to be alright today especially behind some trees. Tennis is not looking good.");
        } else if(res.data.wind.speed <= 15){
            message.reply("The wind today is kinda high I wouldnt reccomend sports unless its forecasted to die down. The temperature is " + res.data.main.temp + " degrees. The real feel is "
            + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Sports today arent looking good.");
        } else if(res.data.wind.speed <= 20){
            message.reply("The wind today is very high I wouldnt recommend going out for sports. The temperature is " + res.data.main.temp + " degrees. The real feel is "
            + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Prepare to get frustrated if you're heading out");
        } else {message.reply("The wind today is crazy! I highly recommend against going out for sports. The temperature is " + res.data.main.temp + " degrees. The real feel is "
            + res.data.main.feels_like+  " degrees. The wind speed is " + res.data.wind.speed +
            "mph. The sky is " + res.data.weather[0].main.toLowerCase()+". Dont do it.")}
    })
}
function giveWeather(message){//add the error log 
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    const city = args[0];
    axios.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&units=imperial&APPID=" + weatherAPPKey)
    .then((res) => { 
        message.reply("The temperature is " + res.data.main.temp + " degrees. The real feel is " + res.data.main.feels_like + " degrees. The wind speed is " + res.data.wind.speed + "mph. The sky is " + res.data.weather[0].main.toLowerCase()+".");   
    })
    .catch((err) => {
        console.error('ERR:', err)
        message.reply("Uh oh! Error! Please make sure that the location is typed in correctly!");
    })
}
/*
function disconnectBot(message){
    const empty = "";
    message.member.voice.channel.join().then(connection => {
        // Playing the music, and, on finish, disconnecting the bot.
        connection.play(empty).on("finish", () => 
            connection.disconnect());
            message.reply("Stopping...");
    }).catch(err => 
        console.log(err))
}*/
function disconnectBot(message){
    const voiceChannel = message.member.voice.channel;
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false
    });
    connection.destroy();
}
function checkTimeFunc(){
    if(date.getHours() == 17){
        client.channels.cache.get(channelTwoID).send('Welcome home from work Andrew. I hope it went well.');
    } else {
        setTimeout(checkTimeFunc, 3600000); //one hour
        console.log("Its "+ date.getHours() + ", lets check again later.")
    }
}
function greetings(){
    if(date.getHours() == 7) {
        console.log("7am");
        client.channels.cache.get(channelOneID).send('Good morning, everyone!.');
        giveAdvice(message);
    } else if (date.getHours() == 0) {
        console.log("midnight");
        client.channels.cache.get(channelTwoID).send("Goodnight, everyone.");
    } else {
        console.log("checked after another hour its currently hour " + date.getHours());
        setTimeout(checkTimeFunc, 3600000);//one hour 
    }
}
function randomDog(message){
    axios.get("https://dog.ceo/api/breeds/image/random")
    .then((res) => {
        message.channel.send(res.data.message)
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " "
}
function randomCat(message){
    axios.get("https://api.thecatapi.com/v1/images/search")
    .then((res) => {
        message.channel.send(res.data[0].url); 
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " "
}
function makeTweets(theTweet){
    T.post('statuses/update', { status: theTweet }, function(err, data, response) {
        saveTweetID(data.id_str, theTweet);
        saveTweetNoID(theTweet);
        data = " ";
        theTweet = " ";
    })
}
function saveTweetID(tweetID, theTweet){
    fs.appendFile('mynewfile1.txt', "\r\n", function (err) {
        if (err) throw err;
      });
    fs.appendFile('mynewfile1.txt', tweetID +"_"+ theTweet, function (err) {
        if (err) throw err;
        console.log('Saved ' + theTweet);
      });
}function saveTweetNoID(theTweet){
    fs.appendFile('tweetsnoids.txt', "\r\n", function (err) {
        if (err) throw err;
      });
    fs.appendFile('tweetsnoids.txt', theTweet + "_" , function (err) {
        if (err) throw err;
        console.log('Saved ' + theTweet + " to file tweetsNoIDs.txt");
      });
}
function readRandomTweet(){
    fs.stat('tweetsnoids.txt', function (error, stats) { 
        fs.open('tweetsnoids.txt', "r", function (error, fd) { 
            var buffer = new Buffer.alloc(stats.size); 
            fs.read(fd, buffer, 0, buffer.length, 
                null, function (error, bytesRead, buffer) { 
                    var data = buffer.toString("utf8"); 
                    var newArray = data.split("_");
                    const randomNumber = Math.floor(Math.random() * newArray.length); 
                    if(newArray[randomNumber] == ""){
                        client.channels.cache.get(channelTwoID).send(newArray[randomNumber - 1])
                    } else {
                        client.channels.cache.get(channelTwoID).send(newArray[randomNumber])
                    }
            }); 
        });
    });
}
function readAllTweets(){//could error out after a lot of tweets, be weary itll need to be fixed maybe at some point 
    fs.stat('tweetsnoids.txt', function (error, stats) { 
        fs.open('tweetsnoids.txt', "r", function (error, fd) { 
            var buffer = new Buffer.alloc(stats.size); 
            fs.read(fd, buffer, 0, buffer.length, 
                null, function (error, bytesRead, buffer) { 
                    var data = buffer.toString("utf8"); 
                    var newArray = data.split("_");
                    client.channels.cache.get(channelTwoID).send(newArray);
            }); 
        });
    });
}
function readAllNotes(message){
    fs.stat('newFile2.txt', function (error, stats) { 
        fs.open('newFile2.txt', "r", function (error, fd) { 
            var buffer = new Buffer.alloc(stats.size); 
            fs.read(fd, buffer, 0, buffer.length, 
                null, function (error, bytesRead, buffer) { 
                    var data = buffer.toString("utf8");  
                    var newArray = data.split(",");
                    for(i=0;i = newArray.length; i++){
                        console.log(newArray[i]);
                        message.reply(newArray[i]);
                    }
                }); 
        });
    });
}
function randomNote(message){
    fs.stat('testfile.txt', function (error, stats) { 
        fs.open('testfile.txt', "r", function (error, fd) { 
            var buffer = new Buffer.alloc(stats.size); 
            fs.read(fd, buffer, 0, buffer.length, 
                null, function (error, bytesRead, buffer) { 
                    var data = buffer.toString("utf8"); 
                    var newArray = data.split(",");
                    const randomNumber = Math.floor(Math.random() * newArray.length);
                    if(newArray[randomNumber] == ""){
                        console.log(newArray[randomNumber - 1])
                        message.reply(newArray[randomNumber - 1])
                    } else {
                        message.reply(newArray[randomNumber])
                    }
            }); 
        });
    });
}
function randomBetween(message){
    if (message.content.startsWith("!randomBetween")){
        const args = message.content.slice().trim().split(/ +/g);
        const command = args.shift().toLowerCase();   
        const randomNumber = Math.floor(Math.random()* args[0]);
        message.channel.send("You randomed between "+ args[0]+" and 0 to get "+ randomNumber);
    }
}
function saveToTextFile(theMessage){
    fs.appendFile('newFile2.txt', theMessage, function (err) {
        if (err) throw err;
        console.log(theMessage)
        console.log('Saved!');
    })
}
function ballsCounter(){
    fs.readFile('ballsCounter.txt', function(err, data) {
        console.log("adding 1 more to the balls counter", data)
        //newData = parseString(data);
        //console.log(newData);

        data = parseInt(data) + 1;
        console.log(data)
        data = data.toString()
        console.log(data)
        fs.writeFile('ballsCounter.txt', data, 'utf8', function (err) {
            if (err) throw err;
            console.log('Saved!');
        })
    });
}
function ballChecker(message){
    fs.readFile('ballsCounter.txt', function(err, data) {
        //console.log("value of data in the ballchecker function: ", data);
        message.reply("The counter is at: " + data)
        return data; 
    });
}
function addToTextFile(message){
    fs.appendFile('Dad_and_Ping.txt', "Ping bot triggered by " + message.author.username + " with message: " + message.content + "\n", function (err) {
        if (err) throw err;
    });
}
function giveAdvice(message){
    axios.get("https://api.adviceslip.com/advice")
    .then((res) => {
        message.reply(res.data.slip.advice)
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " ";
}
function getCat(){
    axios.get("https://cat-fact.herokuapp.com")
    .then((res) => {
        console.log('RES:', res.text)
        client.channels.cache.get(channelTwoID).send(res.text)
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " ";
}
// duplicate?
function getCatFetch(){
    axios.get("https://cat-fact.herokuapp.com")
        .then(response => console.log(response))
        .catch(error => console.error(error) )
}
function getPokemon(message){
    //console.log(message);
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    const pokemonNameOrID = args[0];
    axios.get("https://pokeapi.co/api/v2/pokemon/" + pokemonNameOrID)
        //.then(response => console.log(response))
        //.then(response => console.log("Pokemon Name: " + response.data.name) + 
        //    console.log(response.data.sprites.back_default) + 
        //    console.log("Pokemon ID: " + response.data.id)
        //console.log(response.data.name),
            //pokemonName = response.data.name,
            //pokemonName.charAt(0).toUpperCase() + string.slice(1),
            //client.channels.cache.get(channelTwoID).send(
            //pokemonName
            //+ " \n"
        .then(response => client.channels.cache.get(channelTwoID).send(
            response.data.name 
            + " \n"
            + response.data.sprites.front_default 
            + " \n"
            + "ID: " + response.data.id
            + " \n"
            + "Height: " + response.data.height
            + " \n"
            + "Weight: " + response.data.weight
            ) 
        )
        .catch(error => console.error(error) )
}
function getReadyToSaveToTextFile(message){
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    var stringer = ""
    for(i = 0; i < args.length; i++){
        stringer = stringer + " " + args[i];
    }
    client.channels.cache.get(channelTwoID).send("Saved your idea: "+ stringer + " to the bots notepad!!! (my pc thanks)")
    saveToTextFile(stringer);
}
function getReadyForTweet(message){
    const args = message.content.slice().trim().split(/ +/g);
    const theCommand = args.shift().toLowerCase();
    var stringer = "";
    for(i = 0; i < args.length; i++){
        stringer = stringer + " " + args[i];
    }
    makeTweets(stringer); 
    message.reply('You tweeted: '+ stringer);
}
function rlScrapeFunction(message){
    const id = message.content.slice().trim().split(/ +/g);
    console.log(id[1]);
    message.reply("Working on it! Please wait a second, theres a bit going on behind the scenes because RL doesnt want to make this easy! If nothing pops up be sure to use !rocketLeagueTrackerHelp for more information.");
    //scrapeText('https://rocketleague.tracker.network/rocket-league/profile/steam/' + id[1] + '/overview', '//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[4]/td[2]/div[2]', message)
    scrapeThirdAndFourth('https://rocketleague.tracker.network/rocket-league/profile/steam/' + id[1] + '/overview', message)
}
async function scrapeGithub(message, url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const [el11] = await page.$x('/html/body/div[4]/main/div[2]/div/div[2]/div[2]/div/div[2]/div[1]/div/h2');
    if (el == null){
        browser.close();
        message.reply("Error make sure my account is accessible?")
        return; 
    }
    const contra = await el11.getProperty('textContent');
    const contributions = await contra.jsonValue();
    message.reply(contributions);
    browser.close();
}
async function scrapeThirdAndFourth(url, message){// can i condense this? need to learn more here also i think i got myself blocked :) 
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true
    });
    const page = await browser.newPage(); 
    console.log(browser);
    console.log(page);
    console.log(url);
    page.waitForTimeout(120000);
    await page.goto(url, {waitUntil: [
        'load',
        'domcontentloaded',
      ]});
    page.waitForTimeout(120000);
    await page.screenshot({path: 'testing.png'});//auto delete this after sending 
    message.reply("Heres what I grabbed! ", {
        files: [
            "testing.png"
        ]
    });
    //2nd row title
    const [el5] = await page.$x('/html/body/div/div[2]/div[2]/div/main/div[2]/div[1]/div[2]/div[2]/div[2]/span/span');
    console.log(el5)
    if (el5 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtFive = await el5.getProperty('textContent');
    const titleThree = await txtFive.jsonValue();
    //2nd row Rank
    const [el6] = await page.$x('//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[2]/td[2]/div[2]');
    if (el6 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtSix = await el6.getProperty('textContent');
    const rankThree = await txtSix.jsonValue();
    //2nd row ELO 
    const [el7] = await page.$x('//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[2]/td[3]/div/div[2]/div[1]/div');
    if (el7 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtSeven = await el7.getProperty('textContent');
    const ELOOne = await txtSeven.jsonValue();
    //3rd row title
    const [el1] = await page.$x("/html/body/div/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[3]/td[2]/div[1]/text()");
    if (el1 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtOne = await el1.getProperty('textContent');
    const titleOne = await txtOne.jsonValue();
    //3rd row rank 
    const [el2] = await page.$x('//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[3]/td[2]/div[2]');
    if (el2 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtTwo = await el2.getProperty('textContent');
    const rankOne = await txtTwo.jsonValue();
    //3rd row ELO 
    const [el8] = await page.$x('//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[3]/td[3]/div/div[2]/div[1]/div');
    if (el8 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtEight = await el8.getProperty('textContent');
    const ELOTwo = await txtEight.jsonValue();
    //4th row title
    const [el3] = await page.$x('//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[4]/td[2]/div[1]/text()');
    if (el3 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtThree = await el3.getProperty('textContent');
    const titleTwo = await txtThree.jsonValue();
    //4th row rank 
    const [el4] = await page.$x('//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[4]/td[2]/div[2]');
    if (el4 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtFour = await el4.getProperty('textContent');
    const rankTwo = await txtFour.jsonValue();
    //4th row ELO 
    const [el9] = await page.$x('//*[@id="app"]/div[2]/div[2]/div/main/div[2]/div[3]/div[1]/div/div/div[1]/div[2]/table/tbody/tr[4]/td[3]/div/div[2]/div[1]/div');
    if (el9 == null){
        browser.close();
        message.reply("Error")
        return; 
    }
    const txtNine = await el9.getProperty('textContent');
    const ELOThree = await txtNine.jsonValue();
    console.log(titleThree + rankThree + titleOne + rankOne +  titleTwo + rankTwo) 
    message.reply(titleThree + rankThree + " ELO:"+ ELOOne + "\n" + titleOne + rankOne + " ELO:"+ ELOTwo + "\n" + titleTwo + rankTwo + " ELO:"+ ELOThree);
    browser.close();
}
async function scrapeTwitch(message) { 
    const id = message.content.slice().trim().split(/ +/g);
    const browser = await puppeteer.launch( {headless: false});
    const page = await browser.newPage();
    await page.goto( "https://www.twitch.tv/" + id[1]);
    const [el] = await page.$x('/html/body/div[1]/div/div[2]/div/main/div[2]/div[3]/div/div/div[1]/div[1]/div[2]/div/div[1]/div/div/div/div[1]/div/div/a/div[2]/div/div/div/div/p');
    if (el == null){
        browser.close();
        message.reply("Not live :( ")
        return; 
    }
    const live = await el.getProperty('textContent');
    const isLive = await live.jsonValue();
    console.log(isLive); 
    if (isLive === "LIVE"){
        console.log("True!")
        message.reply(isLive);
    } else {
        console.log("False")
        console.log(isLive)
        message.reply("Not live :( ");
    }
    browser.close();
}
/* Turned off 2/11/2025
setInterval(autoCheckRocketLeague, 900000)
async function autoCheckRocketLeague(){
    const browser = await puppeteer.launch( {headless: false});
    const page = await browser.newPage();
    await page.goto( "https://www.twitch.tv/rocketleague");
    const [el] = await page.$x('/html/body/div[1]/div/div[2]/div/main/div[2]/div[3]/div/div/div[1]/div[1]/div[2]/div/div[1]/div/div/div/div[1]/div/div/a/div[2]/div/div/div/div/p');
    if (el == null){
        browser.close();
        console.log("we have nothing to report at this time :( ")
        return; 
    }
    const live = await el.getProperty('textContent');
    const isLive = await live.jsonValue();
    console.log(isLive); 
    if (isLive === "LIVE"){
        console.log("True!")
        client.channels.cache.get(channelRocketLeague).send("Its live! https://www.twitch.tv/rocketleague");
        browser.close();
    } else {
        console.log("False")
        console.log(isLive)
        browser.close();
    }
    browser.close();
} 
    */
function affirmationAPICall(message){
    axios.get("https://www.affirmations.dev/")
    .then((res) => {
        message.reply(res.data.affirmation);
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " ";
}
function nasaPhoto(message){
    axios.get("https://api.nasa.gov/planetary/apod?api_key=" + process.env.NASA_APIKEY )
    .then((res) => {
        console.log('RES:', res.data.url)
        message.reply(res.data.title + "\n" + res.data.url + "\n" + res.data.explanation);
    })
    .catch((err) => {
        console.error('ERR:', err)
    })
    return " ";
}
function githubQR(message){
    const qrcode = new AttachmentBuilder('./qrcode.png')
        message.channel.send({ 
            content: "https://github.com/apakula036 \n" +
            'QR Code for my github: ', 
            files: [qrcode] 
        });
}
client.login(process.env.BOT_TOKEN)
//npm run devStart