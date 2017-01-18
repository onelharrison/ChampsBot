/* Messenger /Facebook Chat Bot for
 Boys & Girls Championship 2017*/

 const express = require('express')
 const bodyParser = require('body-parser')
 const request = require('request')
 const app = express()

 const token = process.env.MESSENGER_VERIFY_TOKEN
 const accessToken = process.env.MESSENGER_ACCESS_TOKEN

 var boyteam1 = ["Calabar", ""]
 var boyteam2 = ["Kingston College", ""]
 var boyteam3 = ["St. Jago High School", ""]

 var girlteam1 = ["", ""]
 var girlteam2 = ["Kingston College", ""]
 var girlteam3 = ["St. Jago High School", ""]


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
       entry.messaging.forEach(function(messagingEvent) {
         if (messagingEvent.message) {
           receivedMessage(messagingEvent)
         } else if(messagingEvent.postback){
           receivedPostback(messagingEvent)
         }else{
           console.log("Webhook received unknown event: ", event)
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
function pointStanding(recipientId,team1,team2,team3){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Boy's Points Standing",
            subtitle: "Day 2 - #Champs2017\n after 8 finals",
            image_url: "http://i.imgur.com/BqhbJwm.png",
            buttons: [{
              type: "postback",
              title: "Top Boys",
              payload:"top_boys"
            }, {
              type: "postback",
              title: "Boys' List",
              payload: "boys_list",
            }],
          }, {
            title: "Girl's Points Standings",
            subtitle: "Days 2 - #Champs2017\n after 8 finals",
            image_url: "https://champsbot.herokuapp.com/image/girlsPoints.png",
            buttons: [{
              type: "postback",
              title: "Top Girls",
              payload: "top_girls"
            }, {
              type: "postback",
              title: "Girls' List",
              payload: "girls_list",
            }]
          }]
        }
      }
    }
  }
  callSendAPI(messageData)
}


function topStanding(recipientID){
  var messageData = {
    recipient:{
      id:recipientID
    },
    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"list",
          top_element_style: "large",
          elements:[{
            title:"Boy's Point Standing",
            image_url:"https://champsbot.herokuapp.com/image/boysPoints.png",
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
          type:"web_url",
          url:"https://www.google.com.jm/",
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

function welcomeMessage(recipientId){
  var messageData ={
    recipient :{
      id:recipientId
    },
    message:{
      text:"Hi, Im Champs Bot! \n How can I help you today?",
      quick_replies:[
        {
          content_type:"text",
          title:"Points",
          payload:"points_standing"
        },
        {
          content_type:"text",
          title:"Schedule",
          payload:"schedule"
        },{
          content_type:"text",
          title:"Records",
          payload:"records"
        }
      ]
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
         welcomeMessage(senderID)
         break;
      case 'Points':
        pointStanding(senderID)
        break;
      case 'Schedule':
        postSchedule(senderID)
        break;
      case 'Records':
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

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called
  if (payload){
    switch(payload){
      case 'points_standing':
        postStanding(senderID)
        break;
      case 'top_boys':
        topStanding(senderID)
        break;

    }
  }
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
