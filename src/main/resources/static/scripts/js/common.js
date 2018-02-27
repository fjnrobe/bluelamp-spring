$(function() {
    var $li = $('.libraryItem').click(function() {
        $li.removeClass('selected');
        $(this).addClass('selected');
    });
 });