$(document).ready(function(e) {
  // ============ BTN ADD FRIEND
  function ajaxFriend(btnFriend, postUrl, content, addClass, removeClass) {
    btnFriend.prop('disabled', true);
    var userId = btnFriend.attr('data-user');
    var friendId = btnFriend.attr('data-id');
    var data = {
      userId: userId,
      friendId: friendId
    }
    $.ajax({
      url: postUrl,
      type: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: JSON.stringify(data)
    })
    .done(function(xhr) {
      if(xhr.ok) {
        btnFriend.html('<p>' + content + '</p>');
        btnFriend.removeClass(removeClass);
        btnFriend.addClass(addClass);
      }
    })
    .fail(function(error) {
      console.log(error);
    })
    .always(function(){
      btnFriend.prop('disabled', false);
    });
  }
  //add
  $('#users').on('click', '.btn-friend-add', function(e) {
    var btnFriend = $(this);
    e.preventDefault();
    ajaxFriend(btnFriend, '/user/add_friend', 'Remove', 'btn-friend-remove', 'btn-friend-add');
  });
  //remove
  $('#users').on('click', '.btn-friend-remove', function(e) {
    var btnFriend = $(this);
    e.preventDefault();
    ajaxFriend(btnFriend, '/user/remove_friend', 'Add', 'btn-friend-add', 'btn-friend-remove');
  });
  // ============ END BTN ADD FRIEND

  // update read message

  function handleReceiveUnread(e) {
    var li = $(this);
    var data = {
      uid: li.attr('data-uid'),
      user_id: li.attr('data-user-id')
    }
    $.ajax({
      url: 'messages/update_read',
      type: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: JSON.stringify(data)
    })
    .done(function(xhr) {
      if(xhr.ok) {
        li.removeClass("message-unread");
        $("#read-message-modal #send-from").val(xhr.message.sName);
        $("#read-message-modal #message-from").html(xhr.message.sName);
        var time = new Date(xhr.message.uid);
        time = time.toLocaleString();
        $("#read-message-modal #send-from-time").val(time);
        $("#read-message-modal .note-editable.panel-body").html(xhr.message.message);

        $("#read-message-modal").modal();
      }
    })
    .fail(function(error) {
      console.log(error);
    })
    .always(function(){
    });
  }
  $(".list-messages").on('click', '.message-receive', handleReceiveUnread);

});
