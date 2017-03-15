

var nickName = document.getElementById("nickName")
var schoolName = document.getElementById("schoolName")
var logo = document.getElementById("logo")
var gender = document.getElementById("gender")

function addSchool(nickName,schoolName,logo,gender){
  console.log(schoolName)
  firebase.database().ref('schools/' + nickName).set({
    schoolName: ,
    logo: logo,
    nickName: nickName
  });
  if(gender = 0){
    firebase.database().ref('schools/' + nickName + "/boy").update({
      points: 0,
      rank: 0,

    })
  }else if(gender = 1){
    firebase.database().ref('schools/' + nickName + "/girl").update({
      points: 0,
      rank: 0,

    })
  }else {
    firebase.database().ref('schools/' + nickName + "/boy").update({
      points: 0,
      rank: 0,

    })
    firebase.database().ref('schools/' + nickName + "/girl").update({
      points: 0,
      rank: 0,

    })
  }

}
