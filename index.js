const { getJson } = require("serpapi");

const GOOGLE_API_KEY = "5a81319dea3b7654e276f45f1d7a86febbfd67c7384414db3cdbbf8fda33cca1";
const BOT_TOKEN = "6941832197:AAGHHf1I5QVHGKXsRXmMGbb_8db825jj2oM";
const {Telegraf, Markup} = require("telegraf")

const app = new Telegraf(BOT_TOKEN)



const button = Markup.inlineKeyboard([
    Markup.button.callback("👈 prev", "button1"),
    Markup.button.callback("Source🔗", "button2"),
    Markup.button.callback("next 👉 ", "button3")
]);


//  pagination(app)

app.start(async ctx => {
    ctx.reply("Welcome to search same image")
})

app.on("photo", async ctx => {
    try{
        const fileId = await ctx.message.photo[ctx.message.photo.length - 1].file_id;
        app.telegram.getFileLink(fileId)
    .then(async(url) => {
          await getSameImage(url.href)
    })
    .catch(error => console.log(error))
let images;
    function getSameImage(img){
        getJson({
           engine: "google_lens",
           url: img,
           api_key: GOOGLE_API_KEY
         }, (json) => {
            images = json["visual_matches"]
           switchPhoto(images);
         })
    }
    let page = 0
    let imgId;
    function switchPhoto(photos){
        if(photos[page]?.thumbnail){
            ctx.sendPhoto(photos[page].thumbnail, button)
            .then(e => imgId = e.message_id)
        }else{
            ctx.sendPhoto("https://avatars.mds.yandex.net/i?id=90026d235d29db23f0d5ab9faad5c1972c55be04-9149104-images-thumbs&n=13", button)
            .then(e => imgId = e.message_id)
        }

    }

    app.action("button1", async(ctx) => {
        ++page
        console.log(page);
        await ctx.telegram.deleteMessage(ctx.chat.id, imgId).then(e => {
            switchPhoto(images);
        })
    })
    app.action("button3", async(ctx) => {
        ++page
        console.log(page);
        await ctx.telegram.deleteMessage(ctx.chat.id, imgId).then(e => {
            switchPhoto(images);
        })
    })
    app.action("button2", async(ctx) => {
        console.log(page);
        ctx.reply(images[page].link)
        // console.log(images);
    })


    }catch(err){
        console.log(err.message);

    }
})












app.launch();