/* Messenger /Facebook Chat Bot for
 Boys & Girls Championship 2017*/

 const express = require('express')
 const bodyParser = require('body-parser')
 const request = require('request')
 const app = express()
 const firebase = require("firebase");
 const admin = require("firebase-admin");
//const auth =firebase.auth();

 const token = process.env.MESSENGER_VERIFY_TOKEN
 const accessToken = process.env.MESSENGER_ACCESS_TOKEN

 var boyteam1 = ["Calabar","http://i.imgur.com/MC42Cw7.png", "186"]
 var boyteam2 = ["Kingston College","http://i.imgur.com/lv5b3Ja.png", "154"]
 var boyteam3 = ["St. Jago High School","http://i.imgur.com/9aex0JD.png", "123"]

 var girlteam1 = ["Excelsior High School","http://i.imgur.com/kVUhwFN.png" ,"192"]
 var girlteam2 = ["Hydel High School","http://i.imgur.com/VdVI3OU.png","147"]
 var girlteam3 = ["St. Jago High School","http://i.imgur.com/58B5BYY.png","116"]

 var popSchools = ["jago","kingstonCollege","calabar","hydel","excelsior"]

//if (firebase.apps.length === 0) {
 /*var config = {
    apiKey: "AIzaSyCrABjTgsewVKiYHhenGhmqld9gjeonP1o",
    authDomain: "champsbot-a783e.firebaseapp.com",
    databaseURL: "https://champsbot-a783e.firebaseio.com",
    storageBucket: "champsbot-a783e.appspot.com",
    messagingSenderId: "249670934233"
  };
  firebase.initializeApp(config);
  console.log("initializeApp")
//}*/

  // Fetch the service account key JSON file contents
  //var serviceAccount = require("service/champs-d5b65-firebase-adminsdk-iltw1-bcf02f2e31.jsons");

  // Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "champsbot-a783e",
      clientEmail:"firebase-adminsdk-hk865@champsbot-a783e.iam.gserviceaccount.com",
      privateKey:"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDk5AVlixaJv1gV\nP2PEVhyFFVf6E7EHKaRJKZIqQN//m4Wq2M0zGUGfR5pL3H7+4iWMazQ6BJZC+XEt\nVGd8Eec1GauRxTh6PJpmmPB3n2rl0tIH3NQaon5IJiuTB713fWRf+eoXuy4HBrjp\nCiEO6Wy66YFJeK9FP0/qQgmYedvhmmBgmGyeDH/uZ/+FS/wabHZPqbhUIgm0dGbC\nEcZeH7a/NMXozvkivnyvtgAYh3H1DSC+sgv2ODkrLnjeaY7jNOzCxyWE53HI9r0H\nzNjsnF0D4/9xA47aXePlDwcBFQ4g6IsKK7YenjkPAyrEBwj+zMjdZCLBUvVFwXsY\nMjrI8IwtAgMBAAECggEAJNNKyvuFtMPEOCbqtjvkesTkUqe4Y56ff+XgTkwBve4X\no1UeLopxtF6gxHPFOtzHjb/xtyPlyQC45MIfpCZ9PF3U7K7+VyxI6xjQF27ek/tH\nL1yoA2EBUDpT6GPmZ8MU0xwyPX8v+JFsTpICn5OOmsPWuSthh5KYGOhnAtEYP0N5\nOZ+hoT4Bgftt80fR/GABu1/JHY8rM1iN20EVxqWL77Ui2tmbv40EE+VkEWSqSPHg\noPtyW/Yt3oL6rxI5Zwi4K9eJ+vt49mnGhOVLRCjOvI6H6174YsLlPxsHsLxudV5h\ntnhaCTF3zU5h2IojlZVWMNZcTOwVNJ/lFGr5GFVMAQKBgQDzRNDdOLiAlkwj5Ovb\nmKkh8MwBI1hKQDjcDbmEE2KFqNBMJiRDmQOBtKClZ1IkjdG5fLfxvCtJZLUwrCh3\nvnAWKCLPn9bJvXzhUGh+V0FtLWyRrKjx4rI1FVEkS0P2H0I35wdmHSICEmuAJBFo\ngTrFkKsXotRBKz9+DwiPDv2/8QKBgQDw3pM7dzTacKgYpayG9d3Kk6kp2ljhMIxQ\nV4bZm0PtXdgtO5Do+1aq7zMSqToRoyYxlG1laNkIIoUZ6z1jcmkt5gL67qT0hvEx\nNiJPehBH472h+D3Gfc5zU9Bd9Qlw6/jleL+v63Ok8+VhbMd+T+cwmbkc6K7SYwb/\nQwsK0hKL/QKBgCrFx7+N0IrzYjHRd1LmFZ7dGtF8aHKtthGi7CJ30hPUKcOp1Sh5\nh+9PVgufDgdVVDG75w++2RGPfngvXPIo7sZGilBdN0PDaGipXaYRK3TJztQSOqZF\nCLZiqCCshyeIOXlgyqE+sBMTMAmYzeLFDhNcq2h9fbpzozdD52pX5W/RAoGAVo61\nfBYfcSwwzAKlWC58kHK1xKuJawsmMSzy8boBFAi4SbDxJzhC8dRZlygnDPWDISgE\nk/+0ll7JVAIcImOX9n2ErqYZsyHXBOc+Ny9XMG5f1BfAI1dMXFdPNqR6yxCRde0J\nfW9wNGPNF1Ce8/5Ex0tGoWPghww9FHgEPNQ3BAUCgYB4WpWSTMiOCJGswcLOJzzt\nelV01PCHMXKHEjB5NN6KDVT6KL2spIs2Fv7JwckAvEA0yuTkeI9JgP3qzno8ulMv\nxywRi/YjXO0iRZdwNeG78OUhSpgH+J9zGXltmhTRF3n8h+cFgeOm023j8u4Ritbx\nIyxg8hLnCrey4dQ2cIkUwA==\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: "https://champsbot-a783e.firebaseio.com/"
  });

  // As an admin, the app has access to read and write all data, regardless of Security Rules
 var db = admin.database();
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
  method:'DELETE',
  uri:'https://graph.facebook.com/v2.6/me/thread_settings?access_token=${accessToken}',
  qs:{setting_type:"call_to_actions",
      thread_state:"existing_thread"
    },
    json:true
}, (err,res,body) =>{
    //Deal with response
  })

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
       }]
       },
   json: true
}, (err, res, body) => {
// Deal with the response
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

function defaultResponse(recipientId){
  var messageData = {
    recipient:{
      id:recipientId
    },
  message:{
    text:"Let’s get you back on track. I can help you with the following: \n - My Schools: schools you are following and alerts you’re subscribed to",
    quick_replies:[
      {
        content_type:"text",
        title:"My Schools",
        payload:"my schools"
      },
      {
        content_type:"text",
        title:"Points",
        payload:"points"
      },
      {
          content_type:"text",
          title:"News",
          payload:"news"
        },
        {
            content_type:"text",
            title:"Schedule",
            payload:"events"
          },

    ]
  }
  }
  callSendAPI(messageData)
  }

function pointStanding(recipientId){
  sendTextMessage(recipientId,"Do you want boys or girls points?")
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
            image_url: "https://firebasestorage.googleapis.com/v0/b/champsbot-a783e.appspot.com/o/Boys_points.jpg?alt=media&token=40b2625e-816e-46f6-86fe-40e4c9efb5f4",
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
            image_url: "https://firebasestorage.googleapis.com/v0/b/champsbot-a783e.appspot.com/o/Girls_points.jpg?alt=media&token=5fd1341e-6f9c-4097-80cf-165dc725d190",
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

function topStanding(recipientID,team1,team2,team3,gender,gimage){
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
            image_url:gimage,
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
  sendTextMessage(recipientID,"Select an event Day")
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

function generateSchoolTemp(recipientId){
  var schoolName
  var logo
  var rank
  var points
  /*if(gender==="boys"){
      firebase.datbase().ref('/boySchools/' + school).once('value').then(function(snapshot){
        schoolName = snapshot.val().schoolName
        logo = snapshot.val().logo
        rank = snapshot.val().rank
        points = snapshot.val().points
      })
  } else{
    firebase.datbase().ref('/girlSchools/' + school).once('value').then(function(snapshot){
      schoolName = snapshot.val().schoolName
      logo = snapshot.val().logo
      rank = snapshot.val().rank
      points = snapshot.val().points
    })
  }*/
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
            title: "St Jago High School",
            image_url: "https://firebasestorage.googleapis.com/v0/b/champsbot-a783e.appspot.com/o/Jago.jpg?alt=media&token=446a4307-fae0-4186-b88e-6ea1db5ac8ad",
            buttons: [{
              type: "postback",
              title: "Follow",
              payload:"followjago"
            }],
          }]
        }
      }
    }
  }
  callSendAPI(messageData)
}

function displayJago(recipientId){
  var schoolName

  db.ref('/boySchools/jago').on('value',function(snapshot) {
  schoolName = snapshot.val().schoolName
  points = snapshot.val().points
  rank = snapshot.val().rank
  });
  sendTextMessage(recipientId,schoolName)
  sendTextMessage(recipientId,"" + points)
  sendTextMessage(recipientId,"" + rank)
  console.log(schoolName)
}

function topSchools(recipientId,popSchools){
  var schools = new Array()
  db.ref('/girlSchools/').child("hydel").set({
     schoolName:"Hydel High Shcool",
     logo:"https://firebasestorage.googleapis.com/v0/b/champsbot-a783e.appspot.com/o/Hydel.jpg?alt=media&token=f3064801-a407-4027-a27c-6bc006d93c4a",
     points: 0,
     rank:0,
     nickName:"hydel"
   })
   db.ref('/girlSchools/').child("excelsior").set({
      schoolName:"Excelsior High Shcool",
      logo:"https://firebasestorage.googleapis.com/v0/b/champsbot-a783e.appspot.com/o/Hydel.jpg?alt=media&token=f3064801-a407-4027-a27c-6bc006d93c4a",
      points: 0,
      rank:0,
      nickName:"excelsior"
    })
 for (var i = 0; i < 3; i++) {
      db.ref('/boySchools/' + popSchools[0] ).on('value',function(snapshot){
      var school_details= new Array()
       school_details[0] = snapshot.val().schoolName
       school_details[1] = snapshot.val().logo
       school_details[2] = snapshot.val().rank
       school_details[3] = snapshot.val().points
       school_details[4] = snapshot.val().nickName
       schools.push(school_details)
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
              type:"postback",
              title:"Follow School",
              payload:"follow!" + schools[0][4]
            }],
          },
          /*{
            title: schools[1][0],
            image_url: schools[1][1],
            buttons: [{
              type:"postback",
              title:"Follow School",
              payload:"follow!" + schools[1][4]
            }],
          },
          {
            title: schools[2][0],
            image_url: schools[2][1],
            buttons: [{
              type:"postback",
              title:"Follow School",
              payload:"follow!" + schools[2][4]
            }],
          },
          {
            title: schools[3][0],
            image_url: schools[3][1],
            buttons: [{
              type:"postback",
              title:"Follow School",
              payload:"follow!" + schools[3][4]
            }],
          },
          {
            title: schools[4][0],
            image_url: schools[4][1],
            buttons: [{
              type:"postback",
              title:"Follow School",
              payload:"follow!" + schools[4][4]
            }],
          },{
            title: schools[5][0],
            image_url: schools[5][1],
            buttons: [{
              type:"postback",
              title:"Follow School",
              payload:"follow!" + schools[5][4]
            }],
          }*/]
          }
        }
      }
    }
  callSendAPI(messageData)
}

function schoolScore(recipientId,shortName){
  //generate score template
  var schoolName
  var logo
  var rank
  var points
  var nickname
  var follow
  var followbtn
  db.ref('/fans/' + recipientId ).on('value',function(snapshot){
    follow = snapshot.val()
  })
  if (follow != null){
    followbtn = "unfollow"
  }else{
    followbtn = "follow"
  }

  db.ref('/boySchools/' + shortName).on('value',function(snapshot) {
  schoolName = snapshot.val().schoolName
  logo = snapshot.val().logo
  rank = snapshot.val().rank
  points = snapshot.val().points

  });
  if(schoolName != null){
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
              title: schoolName,
              image_url:logo,
              buttons: [{
                type: "postback",
                title: followbtn,
                payload: followbtn +"!"+ nickname
              }],
            }]
          }
        }
      }
    }
    callSendAPI(messageData)
  }

  db.ref('/girlSchools/' + shortName).on('value',function(snapshot) {
  schoolName = snapshot.val().schoolName
  logo = snapshot.val().logo
  rank = snapshot.val().rank
  points = snapshot.val().points

  });
  if(schoolName != null){
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
              title: schoolName,
              image_url:logo,
              buttons: [{
                type: "postback",
                title: followbtn,
                payload: followbtn +"!"+ nickname
              }],
            }]
          }
        }
      }
    }
    callSendAPI(messageData)
  }


}

function inviteFriends(recipientId){
 sendTextMessage(recipientId,"Tap on the “Share” button to invite your friends")
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
            title: "Champs Bot",
            subtitle:"Your digital guide to all things champs. Message e and get the latest updates",
            image_url: "https://firebasestorage.googleapis.com/v0/b/champsbot-a783e.appspot.com/o/bot_logo.jpg?alt=media&token=cb8ab096-1259-47f8-9c45-77a810cc66b2",
            buttons: [{
              type: "element_share",
            }],
          }]
        }
      }
    }
  }
  callSendAPI(messageData)
}

function followSchool(recipientId,payload){
  var result =  payload.split("!")
  db.ref('/fans/').child(result[1]).set({
    senderID : true
  })
  schoolScore(recipientId,result[1])


}

function generateUpdate(recipientId){
  //generate update carosel with news
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
  sendTextMessage(recipientId,"Hi! I'm Champs Bot I can keep you updated with the latest champs scores and news")
  topSchools(recipientId,popSchools)
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
     var simpleText = messageText.toLowerCase()

     // If we receive a text message, check to see if it matches a keyword
     switch (simpleText) {
      case 'start':
          welcomeMessage(senderID)
          sendTextMessage(senderID,"Choose from the list above or type in a school name")
         break;
      case 'points':
        pointStanding(senderID)
        break;
      case 'events':
        postSchedule(senderID)
        break;
      case 'schedule':
        postSchedule(senderID)
      break;
      case 'jago':
          displayJago(senderID)
          generateSchoolTemp(senderID)
          break;
       default:
         defaultResponse(senderID)
     }
   } else if (messageAttachments) {
     sendTextMessage(senderID, "Message with attachment received")
   }
   // Putting a stub for now, we'll expand it in the following steps
   console.log("Message data: ", event.message)
 }

function receivedPostback(event){

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
        topStanding(senderID,boyteam1,boyteam2,boyteam3,"Boy","https://firebasestorage.googleapis.com/v0/b/champsbot-a783e.appspot.com/o/boys.jpg?alt=media&token=9c64ce9e-6cde-4a10-82d1-c84813ee8fe6")
        break;
      case 'top_girls':
        topStanding(senderID,girlteam1,girlteam2,girlteam3,"Girl","https://firebasestorage.googleapis.com/v0/b/champsbot-a783e.appspot.com/o/Girls.jpg?alt=media&token=75d03ed0-ec14-43ea-97e9-562b0ae1fa7f")
        break;
      case 'get_started':
        welcomeMessage(senderID)
        sendTextMessage(senderID,"Choose from the list above or type in a school name")
        break;
      case 'events':
        postSchedule(senderID)
      break;
      case 'invite':
        inviteFriends(senderID)
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
