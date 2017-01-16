/* Messenger /Facebook Chat Bot for
 Boys & Girls Championship 2017*/

 const express = require('express')
 const bodyParser = require('body-parser')
 const request = require('request')
 const app = express()

 const token = process.env.MESSENGER_VERIFY_TOKEN
 const accessToken = process.env.MESSENGER_ACCESS_TOKEN

 app.set('port',(process.env.PORT || 5000))

 app.use(bodyParser.urlencoded({extended:false}))
 app.use(bodyParser.json())

 app.get('/',function(req,res){
   res.send('Champs Bot server page')
 })

 app.get('/webhook/',function(req, res){
   if(req.query['hub.verify_token']===token){
     res.send(req.query['hub.challenge'])
   }
  res.send('Access not authorized')
 })

 app.post('/webhook', function (req, res) {
   var data = req.body;

   // Make sure this is a page subscription
   if (data.object === 'page') {

     // Iterate over each entry - there may be multiple if batched
     data.entry.forEach(function(entry) {
       var pageID = entry.id;
       var timeOfEvent = entry.time;

       // Iterate over each messaging event
       entry.messaging.forEach(function(event) {
         if (event.message) {
           receivedMessage(event);
         } else {
           console.log("Webhook received unknown event: ", event);
         }
       });
     });
     res.sendStatus(200);
   }
 });

function getStarted(){
  var url="https://graph.facebook.com/v2.6/me/thread_settings?access_token=MESSENGER_ACCESS_TOKEN"
  var data = {
    setting_type:"call_to_actions",
    thread_state:"new_thread",
    call_to_actions:[{
      payload:"get_started",
    }]
  }
  request.post({url:url, formData: data}, function(err, httpResponse, body) {
    if (err){
      return console.error('post failed:', err)
    }

    console.log('Post successful!  Server responded with:', body)
  })
}

function postStanding(recipientID,messageText){
  /*var messageData = {
    recipient:{
      id:recipientID
    },
    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"list",
          top_element_style: "compact",
          elements:[{
            title:"Boy's Point Standing",
            image_url:"http://i2.cdn.cnn.com/cnnnext/dam/assets/161103162140-mlk-overlay-tease.jpg",
            subtitle:"After 8 events",
        },
        {
            title:"KC",
            image_url:"https://www.google.com.jm/?imgurl=http%3A%2F%2Fkolors.com%2Fkingston-college-jamaica-logo-215.gif&imgrefurl=http%3A%2F%2Fkolors.com%2Fkingston-college-jamaica-logo&docid=51M8cVTxJWertM&tbnid=dwNJrazo2YFKxM%3A&vet=1&w=220&h=277&bih=702&biw=1364&q=kingston%20college%20logo&ved=0ahUKEwjm1Y6AqMfRAhWDMSYKHasJC1gQMwgnKA0wDQ&iact=mrc&uact=8",
            subtitle:"Points: 186",
        },
        {
          title:"JC",
          image_url:"https://www.google.com.jm/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fen%2F3%2F3d%2FJC_CREST.jpg&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FJamaica_College&docid=KKFW8cwMK-CYvM&tbnid=JDDMjLxwhXnQtM%3A&vet=1&w=260&h=302&bih=702&biw=1364&q=jamaica%20college&ved=0ahUKEwi3x4vuqcfRAhXDTSYKHbMiBNsQMwgvKAAwAA&iact=mrc&uact=8",
          subtitle:"Points:156",
        },{
          title:"Calabar",
          image_url:"https://www.google.com.jm/imgres?imgurl=http%3A%2F%2Fasirimagazine.com%2Fen%2Fwp-content%2Fuploads%2F2014%2F12%2Fcalabar-high-school-white.jpg&imgrefurl=http%3A%2F%2Fasirimagazine.com%2Fen%2Fhistory-pride-of-calabar-high-school-jamaica%2F&docid=xhQaPmA8zTJwJM&tbnid=dpYCUIUpIPbQGM%3A&vet=1&w=429&h=493&bih=702&biw=1364&q=calabar%20high%20school&ved=0ahUKEwilla6AqsfRAhUGSiYKHZYsCWIQMwgtKAAwAA&iact=mrc&uact=8",
          subtitle:"Points:123",
        }
      ],
      buttons:[
        {
          title:"View More",
          type:"postback",
          payload:"veiwMorePoints",
        }
      ]
        }
      }

      }
  }*/
  var messageData = {
    recipient:{
    id:recipientID
  }, message: {
    attachment: {
        type: "template",
        payload: {
            template_type: "list",
            elements: [
                {
                    title: "Classic T-Shirt Collection",
                    image_url: "https://peterssendreceiveapp.ngrok.io/img/collection.png",
                    subtitle: "See all our colors",
                    default_action: {
                        type: "web_url",
                        url: "https://peterssendreceiveapp.ngrok.io/shop_collection",
                        webview_height_ratio: "tall"
                      },
                },
                {
                    title: "Classic White T-Shirt",
                    image_url: "https://peterssendreceiveapp.ngrok.io/img/white-t-shirt.png",
                    subtitle: "100% Cotton, 200% Comfortable",
                    default_action: {
                        type: "web_url",
                        url: "https://peterssendreceiveapp.ngrok.io/view?item=100",
                        webview_height_ratio: "tall",
                        fallback_url: "https://peterssendreceiveapp.ngrok.io/"
                    },
                    buttons: [
                        {
                            title: "Shop Now",
                            type: "web_url",
                            url: "https://peterssendreceiveapp.ngrok.io/shop?item=100",
                            webview_height_ratio: "tall",
                            fallback_url: "https://peterssendreceiveapp.ngrok.io/"
                        }
                    ]
                },
                {
                    title: "Classic Blue T-Shirt",
                    image_url: "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
                    subtitle: "100% Cotton, 200% Comfortable",
                    default_action: {
                        type: "web_url",
                        url: "https://peterssendreceiveapp.ngrok.io/view?item=101",
                        webview_height_ratio: "tall",
                        fallback_url: "https://peterssendreceiveapp.ngrok.io/"
                    },
                    buttons: [
                        {
                            title: "Shop Now",
                            type: "web_url",
                            ur: "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                            webview_height_ratio: "tall",
                            fallback_url: "https://peterssendreceiveapp.ngrok.io/"
                        }
                    ]
                },
                {
                    title: "Classic Black T-Shirt",
                    image_url: "https://peterssendreceiveapp.ngrok.io/img/black-t-shirt.png",
                    subtitle: "100% Cotton, 200% Comfortable",
                    default_action: {
                        type: "web_url",
                        url: "https://peterssendreceiveapp.ngrok.io/view?item=102",
                        webview_height_ratio: "tall",
                        fallback_url: "https://peterssendreceiveapp.ngrok.io/"
                    },
                    buttons: [
                        {
                            title: "Shop Now",
                            type: "web_url",
                            url: "https://peterssendreceiveapp.ngrok.io/shop?item=102",
                            webview_height_ratio: "tall",
                            fallback_url: "https://peterssendreceiveapp.ngrok.io/"
                        }
                    ]
                }
            ],
             buttons: [
                {
                    title: "View More",
                    type: "postback",
                    payload: "payload"
                }
            ]
        }
    }
  }
}

  callSendAPI(messageData);
}

function postSchedule(senderID,messageText){
  //function for post the race schedule
  var messageData={
    recipient:{
      id:recipientID
    }
  }
  callSendAPI(messageData);
}

function newRecords(senderID,messageText){
  //function for managing updates
}



// function for sending simple text messages
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  }
  callSendAPI(messageData)
}

function startupMessage(recipientId,messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment:{
        type:'template',
        payload:{
          template_type:'generic',
          elements:[{
            title:"What do you need ?",
            subtitle:"Pick an option",
            image_url:"",
            buttons:[{
              type:"postback",
              title:"Points Standing",
              payload:"points_standing"
            },{
              type:"postback",
              title:"Race Schedule",
              payload:"schedule"
            },{
              type:"postback",
              title:"New Records",
              payload:"newRecords",
            }]
          }]
        }
      }
    }
  }
  callSendAPI(messageData)
}

//Funtion for handling recieved messages
 function receivedMessage(event) {
   var senderID = event.sender.id
   var recipientID = event.recipient.id
   var timeOfMessage = event.timestamp
   var message = event.message

   console.log("Received message for user %d and page %d at %d with message:",
     senderID, recipientID, timeOfMessage);
   console.log(JSON.stringify(message));

   var messageId = message.mid

   var messageText = message.text
   var messageAttachments = message.attachments

   if (messageText) {

     // If we receive a text message, check to see if it matches a keyword
     switch (messageText) {
      case 'start':
         startupMessage(senderID)
         break;
      case 'Points Standing':
        postStanding(senderID)
        break;
      case 'schedule':
        postSchedule(senderID)
        break;
      case 'records':
        newRecords(senderID)
        break;
       default:
         sendTextMessage(senderID,"say start to see options")
     }
   } else if (messageAttachments) {
     sendTextMessage(senderID, "Message with attachment received")
   }
   // Putting a stub for now, we'll expand it in the following steps
   console.log("Message data: ", event.message)
}

 function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: accessToken},
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id
      var messageId = body.message_id

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId)
    } else {
      console.error("Unable to send message.")
      console.error(response)
      console.error(error)
    }
  })
}

app.listen(app.get('port'), function(){
  console.log('running on port', app.get('port'))
})
