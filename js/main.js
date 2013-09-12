var url ="https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDN2xUJHHxdtWTMeblDPkCdgSDaMzH7buM";

var family = "";
runFont(family);
var families = [];
var visited = [];
var love = [];

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
    $('html, body').animate(
      {scrollTop:$('#content').position().top}, 'slow');
    // return item; Nah, set as placeholder instead
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
        $("em,strong,h1,h2,h3").removeAttr("style");

        // Grabs family details
        $(".variants").html("<dl><dt>Variants</dt><dd>" + type.variants + "</dd> <dt>Subsets</dt><dd>" + type.subsets + "</dd><dt>Version</dt><dd>" + type.version + "</dd><dt>Last Modified</dt><dd>" + type.lastModified + "</dd><dd>" + familyCSS + "</dd></dl>");

        // Grabs the Google Font
        $("head").append("<link href='"+ familyCSS +"' rel='stylesheet' type='text/css' class='style'>");
        $("body").css("font-family",family);

        // If family has italic or 700, allow it
        if($(".variants").text().match('italic')){
          $("em").css("font-style","italic");
        }
        if($(".variants").text().match('700')){
          $("strong,h1,h2,h3").css("font-weight","700");
        }

        // Save visited families
        visited.push( family );
        var visit="";
        $.each(visited, function(i, val) {
          visit+= "<p class='link-history' data-family='"+ val +"'>" + val + "</p>";
        });
        $('.visited').html("<h2>History</h2>"+visit);

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
$(".icon-edit").click(function(){
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
});

// Picks a random font on click
$(".random").click(function(){
  random();
});

// Toggles more information about the family
$(".more").click(function(){
  $(".variants").slideToggle();
  if($(this).hasClass("active")){
    $(this).removeClass("active");
  }
  else {
    $(this).addClass("active");
  }
});

// Toggles more information about the family
$(".history").click(function(){
  $(".visited").slideToggle();
  if($(this).hasClass("active")){
    $(this).removeClass("active");
  }
  else {
    $(this).addClass("active");
  }
});

// Bootstrap Tooltips
$('[data-rel=tooltip]').tooltip({ trigger: "hover", placement:"bottom" });



// Runs to fetch random font
random();