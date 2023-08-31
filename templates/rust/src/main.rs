use serenity::async_trait;
use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::prelude::*;

struct Handler;

const PREFIX: &str = "!";
const TOKEN: &str = "<%= bot-token %>";

#[async_trait]
impl EventHandler for Handler {

    async fn message(&self, ctx: Context, msg: Message) {
        // check if the message starts with the prefix
        if msg.content.starts_with(&PREFIX) && !msg.author.bot {

            // Split the message into command and arguments
            let args = msg.content[PREFIX.len()..].trim().split(' ').collect::<Vec<&str>>();
            let command = args[0];

            // ping - bot will reply with Pong!
            if command == "ping" {
                // send a message to the channel
                if let Err(why) = msg.channel_id.say(&ctx.http, "Pong!").await {
                    println!("Error sending message: {:?}", why);
                }
            }
            // say <message> - bot will send the message
            else if command == "say" {

                // check if the user has provided a message
                if args.len() == 1 {
                    if let Err(why) = msg.reply(&ctx.http, "Please provide a message to send.").await {
                        println!("Error sending message: {:?}", why);
                    }
                    return;
                }

                // send a message to the channel using the rest of the arguments
                if let Err(why) = msg.channel_id.say(&ctx.http, &args[1..].join(" ")).await {
                    println!("Error sending message: {:?}", why);
                }
            }
        }
    }

    async fn ready(&self, _: Context, ready: Ready) {
        println!("Bot is logged in as {}.", ready.user.name);
    }
}

#[tokio::main]
async fn main() {

    // Set gateway intents, which decides what events the bot will be notified about
    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT;


    // Create a new instance of the client
    let mut client = Client::builder(&TOKEN, intents).event_handler(Handler).await.expect("Err creating client");


    // Start the bot
    if let Err(why) = client.start().await {
        println!("Client error: {:?}", why);
    }
}

// for more information on how to use serenity, check out the docs at https://docs.rs/serenity