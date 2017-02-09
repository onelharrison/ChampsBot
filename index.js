/* Messenger /Facebook Chat Bot for
 Boys & Girls Championship 2017*/

 const express = require('express')
 const bodyParser = require('body-parser')
 const request = require('request')
 const app = express()
 const firebase = require("firebase");
 var admin = require("firebase-admin");
// const auth =firebase.auth();

 const token = process.env.MESSENGER_VERIFY_TOKEN
 const accessToken = process.env.MESSENGER_ACCESS_TOKEN

 var boyteam1 = ["Calabar","http://i.imgur.com/MC42Cw7.png", "186"]
 var boyteam2 = ["Kingston College","http://i.imgur.com/lv5b3Ja.png", "154"]
 var boyteam3 = ["St. Jago High School","http://i.imgur.com/9aex0JD.png", "123"]

 var girlteam1 = ["Excelsior High School","http://i.imgur.com/kVUhwFN.png" ,"192"]
 var girlteam2 = ["Hydel High School","http://i.imgur.com/VdVI3OU.png","147"]
 var girlteam3 = ["St. Jago High School","http://i.imgur.com/58B5BYY.png","116"]

 var popSchools = ["jago","kc","calabar","jago","hydel","excelsior"]


 var config = {
    apiKey: "AIzaSyCrABjTgsewVKiYHhenGhmqld9gjeonP1o",
    authDomain: "champsbot-a783e.firebaseapp.com",
    databaseURL: "https://champsbot-a783e.firebaseio.com",
    storageBucket: "champsbot-a783e.appspot.com",
    messagingSenderId: "249670934233"
  };
  firebase.initializeApp(config);


  // Fetch the service account key JSON file contents
  //var serviceAccount = require("service/champs-d5b65-firebase-adminsdk-iltw1-bcf02f2e31.jsons");

  // Initialize the app with a service account, granting admin privileges
/*admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "champs-d5b65",
      clientEmail:"firebase-adminsdk-iltw1@champs-d5b65.iam.gserviceaccount.com",
      privateKey:"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDUQ+yDG5qeQ58y\nvn71YovE5c+9cXbsyQUf/ZwA1J/3fi69mCDDDLmEJ7DpHboG9ymAsJz24Q5Johj5\nWlVYyx25+p6hyNARVXOTVQv0n/SJIV9smDyLKOyEtpm3oCJTcxq5iIlJUn/maZJt\nrrS45N/lVPsolAnET9d2d5SwdESUjk1UO6vkGyCrgKAsr/18h0PpmmLr8Vt4lHOH\nJsrJ3r4GjQi2y8t83Qaev2qMySFBhC6bbILk+h/R9BNWMsyMQiObJTPKbzX8Kyeh\nQO6kHVjg99NxX4UmE2tivxO6R1XLoFaq5x16Rrc9TXow2vdBmddlA6XIdXs/1guF\nBJpgopuxAgMBAAECggEBAMuB59L3dzE/YfVzwCMhfSGkt5xImZ2BSSGXs6b0M/5E\nAyoRHXAD1iWHLE0EDCO7ehYAvizQLzOXbtw6qFL+QhzZ1JcGAb5sr+dUhabeaMPE\ntElYV8uPy9udehkcNWzOkZPJ/N3IdAmDtDjmZCxUevjTlg0ciZSme8v/8BWRE2Nc\noFIQavNXPngaZ1QJozRSe2+cPvTHZziVZ0wzEOiNryRzbvIZeNtEi3V/abxHqH8M\nt9EQEgPx195SGFGpcRV0EqWY8tv5dW5hsG3IhTpwIHMGTn0TpKmNzugLkZ7lgCbm\nJi795OqmKLgJ8WUoaDBVWM783CtJFRsB4nOoFK2BbrUCgYEA7yxBBBdRIxSD17qn\nYMvMT6mX9i1ZHn89IoyE+9lRGvlFgN5D+nREPoIorP7PJN+UQnIK/gfILNbzlSjM\naDv5EvFflomB8roXS6BWg0vB5H7NnbDSPqgfw1y+KVdy0sUBDh9py0HT1hZ7w7Wm\nPVtTAp7zq4MmIabDOnI/f+n9AGsCgYEA4zMJrnAeUzvsZw9Wj3k4JmJCX2BskeYJ\n4ofZgOTh0CMvPf9CUUPMeCIV6AOYfCIYozAZkygW3jq8eVq4I7U+6FAOwyL+6jxI\nj6ZALMru2+DFOwn9jTuudv+C5BPAbvqNjDKrbijnrxLeZwg7/DKMoJSkgVt9SC8e\nFIqYxhH8q1MCgYAF3kgaGZhcC/zQJjxFG7r/mWGpIKO3I9gUKO56X3Kl/se9ybZR\nRtkFz5u/4uCiPvocR0ANy5MVxpBjcITTaeVKmbGGuAkAM6CuslhtEEbJnHLfE5+U\n+fsNiBECYqrmkP7dodeurQbNke+ndaWGi98ViWDhLG6bFMRlgrgcI1mZ0QKBgQCr\n0Xsu2kd0tsqPHgBePFQEYybCrk8s/wTWtdn9KhrDpvghMJtcjaNh7pUWgzGcHsT3\nFHci3Jx+r3i9ZagACR9r3K9tT1fsmG5fhGDf/xAoZJGDloiTeGD2SUEZbv6GbyEA\nt4kBpBmiQujCjm2eyjOjdQX7dc8G+esLqczjbdLhVQKBgQDn5l75RhvZA+GoYZMe\nr/xX5l5ySa5YXfJe5ot6kFOYHBxBFWYkp8+Xmbg0fy746C5zMdmLsvswvMK/0k9q\nr2azQJUAgPIeRco2nirWqC8/xpsIgje2VG00xq9QxaiN7ly/wtENXVfBMvsrr4ZC\nv/lk5DpcYVX1peqn//PEZEiNew==\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: "https://champs-d5b65.firebaseio.com"
  });*/

  // As an admin, the app has access to read and write all data, regardless of Security Rules
//  var db = firebase.database();
/*  var ref = db.ref("restricted_access/secret_document");
  ref.once("value", function(snapshot) {
    console.log(snapshot.val());
  });*/

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
        title:"tst",
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
