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



});
