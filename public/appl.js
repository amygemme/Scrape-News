$.getJSON("/articles", function(data){
    console.log(data, "this is our data")
    for(var i=0; i < data.length; i++){
        $("#nprnews").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<p>");
    }
});

$(document).on("click", "p", function(){
    $("#comment").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data){
        console.log(data);
        $("#comment").append("<h2>" + data.title + "</h2>");
        $("#comment").append("<input id='titleinput' name='titie' >");
        $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#comment").append("<button data-id=' " + data_id + "' id='savenote'> SaveNote </button>");

        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#savenote", function(){
    var thisID = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisID,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
    .then(function(data){
        console.log(data);
        $('#comment').empty();
    });
    
    $("#titleinput").val();
    $("#bodyinput").val();
});