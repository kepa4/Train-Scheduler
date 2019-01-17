$(document).ready(function() {
  var config = {
    apiKey: 'AIzaSyBIomjC_ubaOo37HcgjqM6MYbGakIcHGCg',
    authDomain: 'train-schedule-ce69b.firebaseapp.com',
    databaseURL: 'https://train-schedule-ce69b.firebaseio.com',
    projectId: 'train-schedule-ce69b',
    storageBucket: 'train-schedule-ce69b.appspot.com',
    messagingSenderId: '220848122004',
  };
  firebase.initializeApp(config);

  var db = firebase.firestore();

  db.settings({
    timestampsInSnapshots: true,
  });

  db.collection('trains')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var newRow = $('<tr></tr>');
        newRow.append($('<th></th>', {text: doc.data().name}));
        newRow.append($('<th></th>', {text: doc.data().destination}));
        newRow.append($('<th></th>', {text: doc.data().frequency}));
        newRow.append($('<th></th>', {text: doc.data().firstTime}));
        $('#table').append(newRow);
      });
    });

  $('#submit').on('click', function() {
    event.preventDefault();
    var name = $('#name').val();
    var destination = $('#destination').val();
    var frequency = $('#frequency').val();
    var firstTime = $('#firstTime').val();
    db.collection('trains').add({
      name: name,
      destination: destination,
      frequency: frequency,
      firstTime: firstTime,
    });
  });

  db.ref().on('child_added', function(childSnapshot) {
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firstTime;
    var newRow = $('<tr></tr>');
    newRow.append($('<th></th>', {text: name}));
    newRow.append($('<th></th>', {text: destination}));
    newRow.append($('<th></th>', {text: frequency}));
    newRow.append($('<th></th>', {text: firstTime}));
    $('#table').append(newRow);
  });
});
