jQuery(document).ready(function () {

  // Plugins placing
  $("body").append("<div id='divInfoBoxes'></div>");

});

function getInternetExplorerVersion() {
  var rv = -1;
  // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat(RegExp.$1);
  }
  return rv;
}

function checkVersion() {

  var msg = "You're not using Windows Internet Explorer.";
  var ver = getInternetExplorerVersion();
  if (ver > -1) {
    if (ver >= 8.0)
      msg = "You're using a recent copy of Windows Internet Explorer."
    else
      msg = "You should upgrade your copy of Windows Internet Explorer.";
  }
  alert(msg);

}

function isIE8orlower() {

  var msg = "0";
  var ver = getInternetExplorerVersion();
  if (ver > -1) {
    if (ver >= 9.0)
      msg = 0
    else
      msg = 1;
  }
  return msg;
  // alert(msg);
}

// Info Notification
var InfoBoxes = 0,
  InfoCount = 0,
  InfoBoxesAnchos = 0;


$.infoBox = function (settings, callback) {
  var BoxInfo, content;
  settings = $.extend({
    title: "",
    content: "",
    icon: undefined,
    iconInfo: undefined,
    sound: $.sound_on,
    sound_file: 'infobox',
    color: undefined,
    timeout: undefined,
    colortime: 1500,
    colors: undefined
  }, settings);

  // InfoBox Sound
    if (isIE8orlower() == 0) {
      var audioElement = document.createElement('audio');

      if (settings.sound) {
        settings.sound_file = settings.sound;
      }
      if (navigator.userAgent.match('Firefox/'))
        audioElement.setAttribute('src', "sounds/" + settings.sound_file + ".ogg");
      else
        audioElement.setAttribute('src', "sounds/" + settings.sound_file + ".mp3");

      //$.get();
      audioElement.addEventListener("load", function () {
        audioElement.play();
      }, true);

      audioElement.pause();
      audioElement.play();
  }

  InfoBoxes = InfoBoxes + 1;

  BoxInfo = ""

  var IconSection = "",
    CurrentIDInfobox = "infobox" + InfoBoxes;

  if (settings.iconInfo == undefined) {
    IconSection = "<div class='miniIcono'></div>";
  } else {
    IconSection = "<div class='miniIcono'><i class='miniPic " + settings.iconInfo +
      "'></i></div>";
  }

  if (settings.icon == undefined) {
    BoxInfo = "<div id='infobox" + InfoBoxes +
      "' class='InfoBox animated fadeInRight fast'><div class='textoFull'><span>" + settings.title +
      "</span><p>" + settings.content + "</p></div>" + IconSection + "</div>";
  } else {
    BoxInfo = "<div id='infobox" + InfoBoxes +
      "' class='InfoBox animated fadeInRight fast'><div class='foto'><i class='" + settings.icon +
      "'></i></div><div class='textoFoto'><span>" + settings.title + "</span><p>" + settings.content +
      "</p></div>" + IconSection + "</div>";
  }

  if (InfoBoxes == 1) {
    $("#divInfoBoxes").append(BoxInfo);
    InfoBoxesAnchos = $("#infobox" + InfoBoxes).height() + 40;
  } else {
    var SmartExist = $(".InfoBox").size();
    if (SmartExist == 0) {
      $("#divInfoBoxes").append(BoxInfo);
      InfoBoxesAnchos = $("#infobox" + InfoBoxes).height() + 40;
    } else {
      $("#divInfoBoxes").append(BoxInfo);
      $("#infobox" + InfoBoxes).css("top", InfoBoxesAnchos);
      InfoBoxesAnchos = InfoBoxesAnchos + $("#infobox" + InfoBoxes).height() + 20;

      $(".InfoBox").each(function (index) {

        if (index == 0) {
          $(this).css("top", 20);
          heightPrev = $(this).height() + 40;
          InfoBoxesAnchos = $(this).height() + 40;
        } else {
          $(this).css("top", heightPrev);
          heightPrev = heightPrev + $(this).height() + 20;
          InfoBoxesAnchos = InfoBoxesAnchos + $(this).height() + 20;
        }

      });

    }
  }

  var ThisInfoBox = $("#infobox" + InfoBoxes);

  // IE fix
  // if($.browser.msie) {
  //     // alert($("#"+CurrentIDInfobox).css("height"));
  // }

  if (settings.color == undefined) {
    ThisInfoBox.css("background-color", "#004d60");
  } else {
    ThisInfoBox.css("background-color", settings.color);
  }

  var ColorTimeInterval;

  if (settings.colors != undefined && settings.colors.length > 0) {
    ThisInfoBox.attr("colorcount", "0");

    ColorTimeInterval = setInterval(function () {

      var ColorIndex = ThisInfoBox.attr("colorcount");

      ThisInfoBox.animate({
        backgroundColor: settings.colors[ColorIndex].color,
      });

      if (ColorIndex < settings.colors.length - 1) {
        ThisInfoBox.attr("colorcount", ((ColorIndex * 1) + 1));
      } else {
        ThisInfoBox.attr("colorcount", 0);
      }

    }, settings.colortime);
  }

  if (settings.timeout != undefined) {

    setTimeout(function () {
      clearInterval(ColorTimeInterval);
      var ThisHeight = $(this).height() + 20;
      var ID = CurrentIDInfobox;
      var ThisTop = $("#" + CurrentIDInfobox).css('top');

      // InfoBoxesAnchos = InfoBoxesAnchos - ThisHeight;
      // $("#"+CurrentIDInfobox).remove();

      if ($("#" + CurrentIDInfobox + ":hover").length != 0) {
        //Mouse Over the element
        $("#" + CurrentIDInfobox).on("mouseleave", function () {
          InfoBoxesAnchos = InfoBoxesAnchos - ThisHeight;
          $("#" + CurrentIDInfobox).remove();
          if (typeof callback == "function") {
            if (callback)
              callback();
          }

          var Primero = 1;
          var heightPrev = 0;
          $(".InfoBox").each(function (index) {

            if (index == 0) {
              $(this).animate({
                top: 20
              }, 300);

              heightPrev = $(this).height() + 40;
              InfoBoxesAnchos = $(this).height() + 40;
            } else {
              $(this).animate({
                top: heightPrev
              }, 350);

              heightPrev = heightPrev + $(this).height() + 20;
              InfoBoxesAnchos = InfoBoxesAnchos + $(this).height() + 20;
            }

          });
        });
      } else {
        clearInterval(ColorTimeInterval);
        InfoBoxesAnchos = InfoBoxesAnchos - ThisHeight;

        if (typeof callback == "function") {
          if (callback)
            callback();
        }

        $("#" + CurrentIDInfobox).removeClass().addClass("InfoBox").animate({
          opacity: 0
        }, 300, function () {

          $(this).remove();

          var Primero = 1;
          var heightPrev = 0;
          $(".InfoBox").each(function (index) {

            if (index == 0) {
              $(this).animate({
                top: 20
              }, 300);

              heightPrev = $(this).height() + 40;
              InfoBoxesAnchos = $(this).height() + 40;
            } else {
              $(this).animate({
                top: heightPrev
              });

              heightPrev = heightPrev + $(this).height() + 20;
              InfoBoxesAnchos = InfoBoxesAnchos + $(this).height() + 20;
            }

          });
        })
      }

    }, settings.timeout);
  }

  // Click Closing
  $("#infobox" + InfoBoxes).bind('click', function () {
    clearInterval(ColorTimeInterval);
    if (typeof callback == "function") {
      if (callback)
        callback();
    }

    var ThisHeight = $(this).height() + 20;
    var ID = $(this).attr('id');
    var ThisTop = $(this).css('top');

    InfoBoxesAnchos = InfoBoxesAnchos - ThisHeight;

    $(this).removeClass().addClass("InfoBox").animate({
      opacity: 0
    }, 300, function () {
      $(this).remove();

      var Primero = 1;
      var heightPrev = 0;

      $(".InfoBox").each(function (index) {

        if (index == 0) {
          $(this).animate({
            top: 20,
          }, 300);
          heightPrev = $(this).height() + 40;
          InfoBoxesAnchos = $(this).height() + 40;
        } else {
          $(this).animate({
            top: heightPrev
          }, 350);
          heightPrev = heightPrev + $(this).height() + 20;
          InfoBoxesAnchos = InfoBoxesAnchos + $(this).height() + 20;
        }

      });
    })
  });

}


// .Info Notification
