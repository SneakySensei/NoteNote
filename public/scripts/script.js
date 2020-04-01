$(function(){
    $("body").on("submit", "form", function() {
        $(this).submit(function() {
            return false;
        });
        return true;
    });
});
