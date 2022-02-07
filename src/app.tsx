import React from "react";
import { SettingsSection } from "spcr-settings";

//KodyK77Gzjb8NqPGpcgw
//rezqw3Q4OEPB1m4rmwfw - playlist content class name
//JUa6JJNj7R_Y3i4P8YUX - also this

//Class names from the spotify app
const actionBarFlexBoxClassName = "KodyK77Gzjb8NqPGpcgw"
const playlistContentClassName = "rezqw3Q4OEPB1m4rmwfw"
const playlistContentClassNameDeeper = "JUa6JJNj7R_Y3i4P8YUX"

//Template Strings 
const weightedSwitchTemplateString = `<label class="x-toggle-wrapper x-settings-secondColumn"><input id="weightedSwitch" class="x-toggle-input" type="checkbox"><span class="x-toggle-indicatorWrapper"><span class="x-toggle-indicator"></span></span></label>`

//Const names
const weightedSwitchName = "weightedSwitch";
const weightedSwitchSearch = "#weightedSwitch";


//Data Globals
var weightedness : {[id:string]: boolean} = {};
var weights = [];

//Helper Functions
function htmlToElement(html: string) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function getCurrentPlaylistID()
{
  //Check if currently on some sort of playable thing (has the action bar w/ the play button)
  const bar = document.querySelector('.main-actionBar-ActionBarRow');
  //Find pathname from DOM loc
  const pathname : string = Spicetify.Platform.History.location.pathname
  //if it's a playlist
  if(bar && pathname.includes("playlist"))
  {
    //console.log("Pulling playlist ID from: " + pathname);
    return pathname.substring(10, pathname.length)
  }
  else
  {
    return "noID";
  }
}

//Actual Functionality

//Weighted switch event listener to save ids
function toggleWeightedness(e : any)
{
  //find playlist id, toggle it's weightedness in the weightedness array
  var id = getCurrentPlaylistID()
  weightedness[id] = e.target.checked;
  console.log("Weighted: " + e.target.checked + " for " + id + " full weightedness: " + JSON.stringify(weightedness));

  //store in localstorage
  Spicetify.LocalStorage.set("weightedness", JSON.stringify(weightedness))
}

//Create weighted switch
async function addWeightedSwitch()
{
  //if it already exists on the page, don't add another
  if(document.querySelector("#" + weightedSwitchName))
    return;

  console.log("i think a playlist is selected so i'm tryna add a button");

  //Reference Action Bar
  var playlistActionBar = document.querySelector(".main-actionBar-ActionBarRow")

  //Generate switch from template string
  var testSwitch = htmlToElement(weightedSwitchTemplateString);
  if(!testSwitch)
    return;

  //Find the flex box next to the buttons on the playlist bar which for some reason has the name "KodyK77Gzjb8NqPGpcgw" (very well might change with update)
  var spaceBuffer = document.querySelector(".KodyK77Gzjb8NqPGpcgw")
  var addedSwitch = playlistActionBar?.insertBefore(testSwitch, spaceBuffer)
   
  //Initialize value from weightedness
  var thisWeightedness = weightedness[getCurrentPlaylistID()]
  if(thisWeightedness === undefined)
    thisWeightedness = false
  console.log("setting to " + thisWeightedness.toString())
  //for some reason it's not set it to false, must remove to turn it off
  if(thisWeightedness)
    document.querySelector(weightedSwitchSearch)?.setAttribute("checked", '')
  else
    document.querySelector(weightedSwitchSearch)?.removeAttribute("checked")

  //Add event listener to the added switch
  addedSwitch?.addEventListener('input', toggleWeightedness)
}

async function addWeightSliders(){
  //Grab the playlist content divs
  const playlistContents = document.querySelector("." + playlistContentClassName)?.querySelector("." + playlistContentClassNameDeeper)
  console.log(playlistContents?.childNodes)
  console.log(playlistContents?.childNodes[1].childNodes)
  
  //Grab the playlist content from spotify api
  var currentID = getCurrentPlaylistID()
  
  var uri = Spicetify.URI.fromString(`spotify:playlist:${currentID}`);
  
  const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri.toString()}/rows`, {
            policy: { link: true },
        });
  console.log(res.rows); 
}

// Listen to page navigation and re-apply when DOM is ready
function listenThenApply(pathname: any) {
  const observer = new MutationObserver(function appchange(){
      // Look for the playlist action bar.
      const bar = document.querySelector('.main-actionBar-ActionBarRow');
      if(bar && pathname.includes("playlist"))
      {
        console.log("i think a playlist is selected: " + pathname);
        addWeightedSwitch();
        addWeightSliders();
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

  //pull weightedness and weights from localstorage
  var storedWeightedness = Spicetify.LocalStorage.get("weightedness")
    if(!storedWeightedness)
      Spicetify.LocalStorage.set("weightedness", JSON.stringify({}));
    else
      weightedness = JSON.parse(storedWeightedness);

  //game.isLoaded()
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

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