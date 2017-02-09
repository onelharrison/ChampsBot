/* Messenger /Facebook Chat Bot for
 Boys & Girls Championship 2017*/

 const express = require('express')
 const bodyParser = require('body-parser')
 const request = require('request')
 const app = express()
 var firebase = require("firebase");

 const token = process.env.MESSENGER_VERIFY_TOKEN
 const accessToken = process.env.MESSENGER_ACCESS_TOKEN

 var boyteam1 = ["Calabar","http://i.imgur.com/MC42Cw7.png", "186"]
 var boyteam2 = ["Kingston College","http://i.imgur.com/lv5b3Ja.png", "154"]
 var boyteam3 = ["St. Jago High School","http://i.imgur.com/9aex0JD.png", "123"]

 var girlteam1 = ["Excelsior High School","http://i.imgur.com/kVUhwFN.png" ,"192"]
 var girlteam2 = ["Hydel High School","http://i.imgur.com/VdVI3OU.png","147"]
 var girlteam3 = ["St. Jago High School","http://i.imgur.com/58B5BYY.png","116"]

 var popSchools = ["jago","kc","calabar","jago","hydel","excelsior"]

/* var config = {
     apiKey: "AIzaSyAEhQjo8aI4U4YyRj9pWuvI6BEmiIsC7Fk",
     authDomain: "champs-d5b65.firebaseapp.com",
     databaseURL: "https://champs-d5b65.firebaseio.com",
     storageBucket: "champs-d5b65.appspot.com",
     messagingSenderId: "1003963080880"
   };*/
   //firebase.initializeApp(config);
   var admin = require("firebase-admin");

  // Fetch the service account key JSON file contents
  var serviceAccount = require("https://champsbot.herokuapp.com/champs-d5b65-firebase-adminsdk-iltw1-bcf02f2e31.jsons");

  // Initialize the app with a service account, granting admin privileges
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://champs-d5b65.firebaseio.com"
  });

  // As an admin, the app has access to read and write all data, regardless of Security Rules
  var db = admin.database();
  var ref = db.ref("restricted_access/secret_document");
  ref.once("value", function(snapshot) {
    console.log(snapshot.val());
  });

 //var database = firebase.database();

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

 request.post({
    method: 'POST',
    uri: `https://graph.facebook.com/v2.6/me/thread_settings?access_token=${accessToken}`,
    qs: {
        setting_type: 'call_to_actions',
        thread_state: 'new_thread',
            call_to_actions: [{
                payload: 'get_started'
            }]
        },
    json: true
}, (err, res, body) => {
    // Deal with the response
});

request.post({
   method: 'POST',
   uri: `https://graph.facebook.com/v2.6/me/thread_settings?access_token=${accessToken}`,
   qs: {
     setting_type:"call_to_actions",
     thread_state:"existing_thread",
     call_to_actions:[
       {
         type:"postback",
         title:"Top News",
         payload:"topNews"
       },
       {
         type:"postback",
         title:"Points Standing",
         payload:"points_standing"
       },
       {
         type:"postback",
         title:"Events Schedule",
         payload:"events"
       },
       {
         type:"postback",
         title:"My Schools",
         payload:"myschools"
       },
       {
         type:"postback",
         title:"Invite Friends",
         payload:"invite"
       },
       {
          type:"postack",
          title:"Help",
          payload:"help"
       }]
       },
   json: true
}, (err, res, body) => {
   // Deal with the response
});

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

function setMenu(){
  var messageData = {
    setting_type:"call_to_actions",
    thread_settings:"existing_thread",
    call_to_actions:[
      {
        type:"postback",
        title:"Points Standing",
        payload:"points_standing"
      },
      {
        type:"postback",
        title:"Race Schedule",
        payload:"schedule"
      },
      {
        type:"postback",
        title:"Records",
        payload:"records"
      }
    ]
  }
}

function pointStanding(recipientId){
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
              title:"Boys' List",
              type:"web_url",
              url:"http://gracechamps.com/points/",
              webview_height_ratio: "tall"
            }],
          }, {
            title: "Girl's Points Standings",
            subtitle: "Days 2 - #Champs2017\n after 8 finals",
            image_url: "http://i.imgur.com/UGuW1oi.png",
            buttons: [{
              type: "postback",
              title: "Top Girls",
              payload: "top_girls"
            }, {
              title:"Girls' List",
              type:"web_url",
              url:"http://gracechamps.com/points/",
              webview_height_ratio: "tall"
            }]
          }]
        }
      }
    }
  }
  callSendAPI(messageData)
}

function topStanding(recipientID,team1,team2,team3,gender){
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
            title:gender + "'s Point Standing",
            image_url:"http://i.imgur.com/BWfdgKC.png",
            subtitle:"After 8 events",
        },
        {
            title:team1[0],
            image_url:team1[1],
            subtitle:"Points: "+team1[2],
        },
        {
          title:team2[0],
          image_url:team2[1],
          subtitle:"Points: "+team2[2]
        },{
          title:team3[0],
          image_url:team3[1],
          subtitle:"Points: "+team3[2],
        }
      ],
      buttons:[
        {
          title:"View More",
          type:"web_url",
          url:"http://gracechamps.com/points/",
          webview_height_ratio: "tall"
        }
      ]
        }
      }

      }
  }
  callSendAPI(messageData);
}

function postSchedule(recipientID){
  //function for post the race schedule
  var messageData={
    recipient:{
      id:recipientID
    },
    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"generic",
          elements:[
            {
              title:"Day 1 - March 28th",
              subtitle:"#Champs2017",
              image_url:"http://i.imgur.com/Tt4EF9i.png",
              buttons:[{
                title:"Day 1 Events",
                type:"web_url",
                url:"https://www.google.com/",
                webview_height_ratio: "tall"
              }]
            },
            {
              title:"Day 2 - March 29th",
              subtitle:"#Champs2017",
              image_url:"http://i.imgur.com/3bGHJvf.png",
              buttons:[{
                title:"Day 2 Events",
                type:"web_url",
                url:"https://www.google.com/",
                webview_height_ratio: "tall"
              }]
            },
            {
              title:"Day 3 - March 30th",
              subtitle:"#Champs2017",
              image_url:"http://i.imgur.com/JKl7yoT.png",
              buttons:[{
                title:"Day 3 Events",
                type:"web_url",
                url:"https://www.google.com/",
                webview_height_ratio: "tall"
              }]
            },
            {
              title:"Day 4 - March 31th",
              subtitle:"#Champs2017",
              image_url:"http://i.imgur.com/a112XYq.png",
              buttons:[{
                title:"Day 4 Events",
                type:"web_url",
                url:"https://www.google.com/",
                webview_height_ratio: "tall"
              }]
            },
            {
              title:"Day 5 - April 1st",
              subtitle:"#Champs2017",
              image_url:"http://i.imgur.com/ZCeoA7m.png",
              buttons:[{
                title:"Day 5 Events",
                type:"web_url",
                url:"https://www.google.com/",
                webview_height_ratio: "tall"
              }]
            }
          ]

        }
      }

    }
  }
  callSendAPI(messageData);
}

function topSchools(recipientId){
  var schools = new Array(6)
  for (var i = 0; i < schools.length; i++) {
      firebase.database().ref('/boySchools/' + popSchools[i]).once('value').then(function(snapshot) {
          schools[i][0] = snapshot.val().schoolName;
          schools[i][1] = snapshot.val().logo;
          schools[i][2] = snapshot.val().rank;
          schools[i][3] = snapshot.val().points;
          return schools

    })
  }
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
            title: schools[0][0],
            image_url: schools[0][1],
            buttons: [{
              type:"payload",
              title:"Follow School",
              payload:"follow" + schools[0][0]
            }],
          },{
            title: schools[1][0],
            image_url: schools[1][1],
            buttons: [{
              type:"payload",
              title:"Follow School",
              payload:"follow" + schools[1][0]
            }],
          },{
            title: schools[2][0],
            image_url: schools[2][1],
            buttons: [{
              type:"payload",
              title:"Follow School",
              payload:"follow" + schools[2][0]
            }],
          },{
            title: schools[3][0],
            image_url: schools[3][1],
            buttons: [{
              type:"payload",
              title:"Follow School",
              payload:"follow" + schools[3][0]
            }],
          },{
            title: schools[4][0],
            image_url: schools[4][1],
            buttons: [{
              type:"payload",
              title:"Follow School",
              payload:"follow" + schools[4][0]
            }],
          },{
            title: schools[5][0],
            image_url: schools[5][1],
            buttons: [{
              type:"payload",
              title:"Follow School",
              payload:"follow" + schools[5][0]
            }],
          },{
            title: schools[6][0],
            image_url: schools[6][1],
            buttons: [{
              type:"payload",
              title:"Follow School",
              payload:"follow" + schools[6][0]
            }],
          },]
        }
      }
    }
  }
  callSendAPI(messageData)

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
  //sendTextMessage(recipientId,"Choose from the list above or type in a school name")
  topSchools(recipientId)
  sendTextMessage(recipientId,"Hi! I'm Champs Bot I can keep you updated with the latest champs scores and news")

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
      case 'Events':
        postSchedule(senderID)
        break;
      case 'Records':
        newRecords(senderID)
        break;
      case 'points_standing':
        pointStanding(senderID)
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
        pointStanding(senderID)
        break;
      case 'top_boys':
        topStanding(senderID,boyteam1,boyteam2,boyteam3,"Boy")
        break;
      case 'top_girls':
        topStanding(senderID,girlteam1,girlteam2,girlteam3,"Girl")
        break;
      case 'get_started':
        welcomeMessage(senderID)
        break;
      case 'events':
        postSchedule(senderID)
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
