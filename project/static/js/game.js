socket = io.connect("/game");

if (typeof user_id != 'undefined') {
  socket.emit('connect', user_id, username);
}

$(window).on("beforeunload", function() {
  socket.emit("disconnect", user_id);
})

socket.on("change_user_list", function(obj){
  delete obj[user_id];
  RedrawUserList(obj)
});

socket.on("new_invite", function(obj){
  SetNotificationMessage(obj[0], "info");
});

socket.on("game_started", function(obj){
  SetNotificationMessage(obj[0], "info");
});

socket.on("game_over", function(obj){
  SetNotificationMessage(obj[0][0], obj[0][1]);
  $(".gameover").animate({opacity: "show"}, "slow");
});

socket.on("opponent_moved", function(obj){
  $('#cell' + obj[1]).html(obj[0]);
  $('#cell' + obj[1]).removeClass().addClass('checked-' + obj[0]);
  if (typeof obj[2] != 'undefined') {
    SetNotificationMessage(obj[2], "warning");
  }
  SwapUser();
});

function MakeMove(sender, move) {
  if (player == current_player && game_over == "false") {
    if ($(sender).text().trim() == "") {
      $(sender).html(player);
      $(sender).removeClass().addClass('checked-' + player);
      SwapUser();
      $.post(create_move_url, {'move': move}, function(data) {
        if (data.length) {
          SetNotificationMessage(data, "warning");
        }
      });
    }
  }
}

function SwapUser() {
  var swap = player == "x" ? "o" : "x";
  if (current_player == player) {
    current_player = swap;
  } else {
    current_player = player;
  }
}

function SetNotificationMessage(message, status) {
  var $panel = $(".notifications-container #notification-panel");
  $('.panel-body', $panel).html(message);
  $panel.removeClass();
  $panel.addClass('panel panel-' + status);
  $panel.removeClass('hidden');
}

function RedrawUserList(users) {
  var $container = $('#user-list');
  var $links = $('#user-links', $container);
  if($container.length) {
    $links.empty();
    for (var user in users) {
      if (users.hasOwnProperty(user)) {
        $links.append(
          "<a href='javascript:;' class='list-group-item user-invite' data-pk='"
           + user + "'>" + users[user] + "</a>"
        )
      }
    }
  }
  if($links.length) {
    $('#title-empty', $container).addClass("hidden");
    $('#title-users-exists', $container).removeClass("hidden");
  }
}

$('#user-list').on('click', '.user-invite', function () {
  var $pk = $(this).data('pk');
  var $form = $('.invite-form');
  $("input[name='invitee_pk']", $form).val($pk)
  $form.submit();
});
