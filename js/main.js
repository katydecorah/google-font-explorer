var url ="https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDzNP2S2VIo_jiErF8L--b6V8bkaKoQNQg";

var family = "";
runFont(family);
var families = [];
var visited = [];
var love = [];

$(".no-js").hide();

// pushes all the font families to an array
$.getJSON(url,function(json){
  $.each(json.items,function(i,type){
    families.push(type.family);
  });
});

// Bootstrap Typeahead
$('#font').typeahead({
  source: families,
  updater:function (item) {
    runFont(item);
    $("#font").attr("placeholder",item);

  }
});

// Gets the font based on family name
function runFont(family) {
  $.getJSON(url,function(json){
    $.each(json.items,function(i,type){
      if (type.family === family) {
        var familyPlus = family.replace(/\s/g, '+');
        var familyCSS = "http://fonts.googleapis.com/css?family=" + familyPlus + ":" + type.variants + "";

        // Removes previous family and style
        $(".style").remove();
        $("style").remove();

        // Grabs family details
        $("#variants").html("<dl><dt class='horizontal'>Variants</dt><dd>" + type.variants + "</dd> <dt class='horizontal'>Subsets</dt><dd>" + type.subsets + "</dd><dt class='horizontal'>Version</dt><dd>" + type.version + "</dd><dt class='horizontal'>Last Modified</dt><dd>" + type.lastModified + "</dd><dt>HTML</dt><dd><pre><code class='language-markup'>&lt;link href='"+familyCSS+"' rel='stylesheet' type='text/css'&gt;</code></pre></dd><dt>CSS</dt><dd><pre><code class='language-css'>font-family: '"+family+"', sans-serif;</code></pre></dd></dl><a href='http://www.google.com/fonts#UsePlace:use/Collection:"+familyPlus+"' class='btn'>View on Google Fonts</a>");

        // Grabs the Google Font
        $("head").append("<link href='"+ familyCSS +"' rel='stylesheet' type='text/css' class='style'>");
        $("body").css("font-family",family);

        // If family has italic or 700, allow it
        if($("#variants").text().match('italic')){
          $("head").append("<style>em { font-style: italic; }");
        }
        if($("#variants").text().match('700')){
          $("head").append("<style>strong,h1,h2,h3 { font-weight: 700; }");
        }
        else if($("#variants").text().match('800')){
          $("head").append("<style>strong,h1,h2,h3 { font-weight: 800; }");
        }
        else if($("#variants").text().match('900')){
          $("head").append("<style>strong,h1,h2,h3 { font-weight: 900; }");
        }

        // Save visited families
        visited.push( family );
        var visit="";
        $.each(visited, function(i, val) {
          visit+= "<li class='link-history' data-family='"+ val +"'>" + val + "</li>";
        });
        $('#visited').html(visit);

        // Creates link to view that font again
        $(".link-history").click(function(){
          var dat = $(this).attr("data-family");
          runFont(dat);
          $("#font").attr("placeholder",dat);

          // remove first instance from array
          if ($.inArray(dat, visited) !== -1) {
            visited.splice( $.inArray(dat, visited), 1 );
          }
        });

      }
    });
});
}

// Make favorites ... work in progress
$(".heart").click(function(){
  var loveIt = $("#font").attr("placeholder");
  love.push(loveIt);
  $(this).addClass("active");
  //alert(love);
});



// Gets a random font
function random() {
  $.getJSON(url,function(json){
    var count = json.items.length,
    random = Math.ceil(Math.random() * count);
    $.each(json.items,function(i,type){
      if(i === random){
        var family = type.family;
        $("#font").attr("placeholder", family);
        runFont(family);
      }
    });
  });
  $(".heart").removeClass("active");
}

// Make content area editable
/*
$(".edit").click(function(){
  if($(this).hasClass("active")){
    $(this).removeClass("active");
    $("#content").removeAttr("contenteditable");
  }
  else {
    $(this).addClass("active");
    $("#content").attr("contenteditable","true").focus();
    $('html, body').animate(
      {scrollTop:$('#content').position().top}, 'slow');
  }
});*/

// Picks a random font on click
$(".random").click(function(){
  random();
});


// Bootstrap Tooltips not for mobile-ish
if ($(window).width() > 800) {
  $('[data-rel=tooltip]').tooltip({ trigger: "hover", placement:"bottom" });
}


// Runs to fetch random font
random();
