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

function startupMessage(recipientId,,messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment:{
        type:'template',
        payload:{
          template_type:'genric',
          elements:[{
            title:"What do you need ?",
            subtitle:"Pick an option",
            image_url:"http://messengerdemo.parseapp.com/img/rift.png",
            buttoms:[{
              type:"postback",
              title:"Points Standing",
              payload:"points_standing"
            },{
              type:"postback",
              title:"Raace Schedule",
              payload:"schedule"
            },{
              type:"postback",
              title:"New Records",
              payload:"newrecords"
            },{
              type:"postback",
              title:"Get Updates",
              payload:"updates",
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
     // and send back the example. Otherwise, just echo the text we received.
     switch (messageText) {
       case 'hello':
         startupMessage(senderID)
         break;

       default:
         sendTextMessage(senderID,"say hello to see options")
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
