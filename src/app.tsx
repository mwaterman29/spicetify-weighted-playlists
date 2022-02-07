import React from "react";
import { SettingsSection } from "spcr-settings";

//KodyK77Gzjb8NqPGpcgw
//rezqw3Q4OEPB1m4rmwfw - playlist content class name
//JUa6JJNj7R_Y3i4P8YUX - also this

const switchTemplateString = `<label class="x-toggle-wrapper x-settings-secondColumn"><input id="settings.showFriendActivity" class="x-toggle-input" type="checkbox"><span class="x-toggle-indicatorWrapper"><span class="x-toggle-indicator"></span></span></label>`

const biasedSwitchName = "testBtn";

function htmlToElement(html: string) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

async function addButton()
{
  //if it already exists on the page, don't add another
  if(document.querySelector("#" + biasedSwitchName))
    return;

  console.log("i think a playlist is selected so i'm tryna add a button");

  //try and add a button
  var playlistActionBar = document.querySelector(".main-actionBar-ActionBarRow")
  const testBtn = document.createElement("button")
  testBtn.id = biasedSwitchName
  testBtn.textContent = "test"

  //switch
  var testSwitch = htmlToElement(switchTemplateString);
  if(!testSwitch)
    return;

  //Find the flex box next to the buttons on the playlist bar which for some reason has the name "KodyK77Gzjb8NqPGpcgw" (very well might change with update)
  var spaceBuffer = document.querySelector(".KodyK77Gzjb8NqPGpcgw")
  playlistActionBar?.insertBefore(testBtn, spaceBuffer)
  playlistActionBar?.insertBefore(testSwitch, spaceBuffer)

  console.log("append attempted");
}

// Listen to page navigation and re-apply when DOM is ready
function listenThenApply(pathname: any) {
  const observer = new MutationObserver(function appchange(){
      // Look for the playlist action bar.
      const bar = document.querySelector('.main-actionBar-ActionBarRow');
      if(bar && pathname.includes("playlist"))
      {
        console.log("i think a playlist is selected: " + pathname);
        addButton();
        observer.disconnect();
      }
      else
      {
        console.log("i think a playlist is NOT selected.");
      }
  })
  // I need to include subtree because the Search page only has one child and the content is under there
  observer.observe(document,{ childList: true, subtree: true });
}



async function main() {
  
  //Add settings 
  const settings = new SettingsSection("Song Weighting", "song-weights");

  //min and max weight
  settings.addInput("min-weight", "Minimum Song Weight", "0.01");
  settings.addInput("max-weight", "Maximum Song Weight", "100");

  //apply
  settings.pushSettings();

  //game.isLoaded()
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  //addButton();

  // Initial scan on app load
  listenThenApply(Spicetify.Platform.History.location.pathname);

  // Listen for page navigation events
  Spicetify.Platform.History.listen(({ pathname } : any) => {
      listenThenApply(pathname);
  });

  // Show message on start.
  //Spicetify.showNotification("test! 2");
}
export default main;

//Dump of stuff

/*

//make something
  var testIcon = React.createElement(
    "testIcon",
    {
      width: 30,
      height: 30,
      fill: "currentColor"
    }
  );

  Spicetify.ReactDOM.render(testIcon, Spicetify.ReactComponent.PlaylistMenu);


  
  //Add context menu item on a song
  var testButton : Spicetify.ContextMenu.Item = new Spicetify.ContextMenu.Item(
    //Name
    "Test Button",
    //On Click Lambda
    () =>
    {
      Spicetify.showNotification("clicked the test button :)");
    }
  )
  //Add to context menu
  testButton.register();
  */