$(function() {

  var host = location.origin.replace(/^http/, 'ws')
  var ws = new WebSocket(host);
  ws.onmessage = function (event) {

    var data = JSON.parse(event.data);
    console.log(data);
    var name = data.name;
    var msg = data.msg;
    var name_span = $('<span></span>').addClass('name').html(name);
    var msg_div = $('<div></div>').html(name_span).append(msg);

    setUsers(data.users);

    $('#chatLog').append(msg_div);

  };

  var setUsers = function (users) {
    $('#users li').remove();



    for (user in users) {
      var name = users[user]; 
      var nameEntry = $('<li></li>').html(name);
      $('#users').append(nameEntry);
    }
  };

  $('#submit').on('click', function() {
    var name = $('#name').val();

      if( name !== "" ) {
          $('#name').prop('disabled', true);
      }

    var $message = $('#message');
    var msg = $message.val();

    if(msg.length === 0)
        return;

    console.log('sending: ' + name + ": " + msg);

    ws.send(JSON.stringify({ name: name, msg: msg}));
    $message.val('');

  });

});