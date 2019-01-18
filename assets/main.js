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
  getData();
  function getData() {
    $('#table').empty();
    var newRow = $('<tr></tr>');
    newRow.append($('<th></th>', {text: 'Train Name'}));
    newRow.append($('<th></th>', {text: 'Destination'}));
    newRow.append($('<th></th>', {text: 'Frequency (min)'}));
    newRow.append($('<th></th>', {text: 'Next Arrival'}));
    newRow.append($('<th></th>', {text: 'Minutes Away'}));
    $('#table').append(newRow);
    db.collection('trains')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var firstTime = doc.data().firstTime;
          var frequency = doc.data().frequency;
          var firstTimeConverted = moment(firstTime, 'HH:mm').subtract(
            1,
            'years',
          );
          var currentTime = moment();
          var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
          var tRemainder = diffTime % frequency;
          var minutesTillTrain = frequency - tRemainder;
          var nextTrain = moment().add(minutesTillTrain, 'minutes');
          var arrivalTime = moment(nextTrain).format('hh:mm');
          var newRow = $('<tr></tr>');
          newRow.append($('<th></th>', {text: doc.data().name}));
          newRow.append($('<th></th>', {text: doc.data().destination}));
          newRow.append($('<th></th>', {text: doc.data().frequency}));
          newRow.append($('<th></th>', {text: arrivalTime}));
          newRow.append($('<th></th>', {text: minutesTillTrain}));
          $('#table').append(newRow);
        });
      });
  }

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
    getData();
  });

  setInterval(function() {
    getData();
  }, 60000);
});
