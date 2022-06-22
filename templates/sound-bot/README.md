<div id="logo" align="center">
  <a href="https://github.com/emilkrebs/sound-bot" target="_blank" rel="noopener noreferrer">
	  <img width="256" alt="Sound-Bot Logo" src="https://raw.githubusercontent.com/emilkrebs/Sound-bot/main/logo.svg">
	</a>
  <h3>
    Create annoying discord bots
  </h3>
</div>

<div id="badges" align="center">
  
   [![Build](https://github.com/emilkrebs/sound-bot/actions/workflows/build.yml/badge.svg)](https://github.com/emilkrebs/sound-bot/actions/workflows/build.yml)
   [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/emilkrebs/Sound-bot)

</div>


<hr>

Play a sound in a discord channel indefinitely.
I created this to annoy me and my friends on our discord server.

**You WILL get annoyed very fast.**

# Getting started
- Install [node.js](https://nodejs.org/en/)
- If you don't already have a Discord Bot, create one [here](https://discord.com/developers/applications/)
- Clone the repository using `git clone https://github.com/emilkrebs/sound-bot.git`
- Create a `config.json` file that looks like this:
```json
{
	"token":"your-bot-token",
	"songUrl":"your-song-url",
	"playCommand":"your-play-command"
}

```
- `npm i` to install all required dependencies
- `npm run start` to start the bot

# Example
Demo Bot (Offline): 
[Invite](https://discord.com/oauth2/authorize?client_id=943570593666719856&permissions=3148288&scope=bot)

Configuration in the `config.json` file:
```json
{
	"token":"your-bot-token",
	"songUrl":"https://github.com/emilkrebs/Sound-bot/raw/main/assets/super-idol.mp3",
	"playCommand":"!superidol"
}

```
![Screenshot](https://user-images.githubusercontent.com/68400102/154546484-ba495a30-9f20-4873-baf2-4541c9ab4987.png)

## Please note
**This repo is created for fun purposes. No contributors, major or minor, are to fault for any actions done by this repo**

## Known Issues

None

[Add Issue](https://github.com/emilkrebs/sound-bot/issues/new)
