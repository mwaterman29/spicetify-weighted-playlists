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
const weightButtonTemplateString = `<input type="button" class="weight-slider-access-button" value="Weight" style="background-color:#121212;"`
const weightSliderPopupTemplateString = `<div class="weight-slider-popup" style="z-index: 10000; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(200px, 200px); background-color:Tomato; border-radius: 10px;"> <p>Weight: </p> <div class="slidecontainer"> <input type="range" min="0.01" max="100" value="1" class="slider" id="myRange"> </div> </div>`
//Const names
const weightedSwitchName = "weightedSwitch";
const weightedSwitchSearch = "#weightedSwitch";

//Data Globals
var settings : SettingsSection
var weightedness : {[id:string]: boolean} = {};
var weights : {[playlistId:string] : {[songId:string]: number}} = {};

//Misc Globals
var currentPlaylistID : any
var selectedSong = ""
var selectedPlaylistContents : any

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
    var id = pathname.substring(10, pathname.length)
    currentPlaylistID = id
    return id
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

  //if toggled on, add weight sliders
  if(weightedness[id])
  {
    addWeightSliders(document.querySelector("." + playlistContentClassName)?.querySelector("." + playlistContentClassNameDeeper));
  }
  else
  {
    removeWeightSliders()
  }
}

//Create weighted switch
async function addWeightedSwitch()
{
  //if it already exists on the page, don't add another
  if(document.querySelector("#" + weightedSwitchName))
    return;

  //console.log("i think a playlist is selected so i'm tryna add a button");

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
  //console.log("setting to " + thisWeightedness.toString())
  //for some reason it's not set it to false, must remove to turn it off
  if(thisWeightedness)
    document.querySelector(weightedSwitchSearch)?.setAttribute("checked", '')
  else
    document.querySelector(weightedSwitchSearch)?.removeAttribute("checked")

  //Add event listener to the added switch
  addedSwitch?.addEventListener('input', toggleWeightedness)
}

//Weight Slider Popup:
const weightSliderPopupString = 
`
<div class="weight-slider-popup">
<style>
  .weight-slider-popup{
    z-index: 10000;
    position: absolute; 
    inset: 0px auto auto 0px; 
    margin: 0px; transform: translate(100px, 100px); 
    background-color:#333333; border-radius: 10px; 
    height:60px; width:200px;
  }
  .weight-slider 
  {
    -webkit-appearance: none;  /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 10px; /* Specified height */
    background: #d3d3d3; /* Grey background */
    outline: none; /* Remove outline */
    opacity: 1; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: .2s; /* 0.2 seconds transition on hover */
    transition: opacity .2s;
    border-radius: 5px;
    position: absolute; 
    width:90%; 
    bottom:10%; 
    left:5%;
  }
  .weight-slider::-webkit-slider-thumb 
  {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%; 
    background: #1ed760;
    cursor: pointer;
  }
  .weight-text-container{
    position: absolute;
    top:5%;
    left:5%;
  }
  .weight-slider-x-button{
    background-color:#333333; 
    color:#121212; 
    font-weight:bold; 
    font-size:20px; 
    border-style:none;
    outline:none
  }
  </style>
  <div class="weight-text-container">
    <p style="color:#1ed760" class="weight-text">Weight:</p> 
  </div>
  <div style="position: absolute; top:5%; right:5%; outline:none">
    <input type="button" value="x" class="weight-slider-x-button">
  </div>
  <div class="weight-slider-container">
    <input type="range" min="0.01" max="100" step="0.01" value="1" class="weight-slider" id="myRange">
  </div> 
</div>
`

async function initializeWeightsForPlaylist(id: string)
{
  console.log(`assessing: ${weights[id]} to be ${(weights[id]) != undefined} `)

  //if this playlist already has weights, don't redo it.
  if(weights[id])
    return;


  //Grab the playlist content from spotify api
  var uri = Spicetify.URI.fromString(`spotify:playlist:${id}`);
  const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri.toString()}/rows`, {
            policy: { link: true },
        });
  selectedPlaylistContents = res.rows

  //set weights[id] to blank
  weights[id] = {}

  //fill in each song to have default weight of 1
  for(let i = 0; i < selectedPlaylistContents.length; i++)
  {
    var songId = selectedPlaylistContents[i].link.split(':')[2];
    weights[id][songId] = 1;
    //console.log(`setting ${songId}`);
  }
}

//Function to create the weight slider popup window
async function openWeightSliderPopup(e : any)
{
  //console.log(`current song is: ${selectedSong}`)
  //console.log(e);
  //console.log(e.target);
  //console.log(document)

  //grab variables and insert them into string
  var x = e.x;
  var y = e.y;

  //stick into style attribute
  var popupPositioningStyleString = `transform: translate(${x}px, ${y}px)`

  //Create the element
  var popup = htmlToElement(weightSliderPopupString);
  if(!popup)
    return

  //if it already exists, remove it
  document.querySelector(`.weight-slider-popup`)?.remove()

  //add popup to window
  var popupNode = document.querySelector("body")?.appendChild(popup)

  //set its position with style string
  document.querySelector(`.weight-slider-popup`)?.setAttribute("style", popupPositioningStyleString)

  //display current weight
  var initialWeightText = document.querySelector(`.weight-text`)
  //error handling
  if(!initialWeightText)
      return
  if(!weights[currentPlaylistID][selectedSong])
    weights[currentPlaylistID][selectedSong] = 1;
  //set display
  initialWeightText.textContent = `Weight: ${weights[currentPlaylistID][selectedSong]}`;

  //add event listeners for:

  //close button
  document.querySelector(`.weight-slider-x-button`)?.addEventListener(`click`, function()
  {
    document.querySelector(`.weight-slider-popup`)?.remove()
  })

  //set min, max, and current value on slider
  var slider = document.querySelector(`.weight-slider`)
  slider?.setAttribute("min", settings.getFieldValue("min-weight"))
  slider?.setAttribute("max", settings.getFieldValue("max-weight"))
  slider?.setAttribute("value", weights[currentPlaylistID][selectedSong].toString())
  
  //weight change
  document.querySelector(`.weight-slider`)?.addEventListener(`input`, function(e : any)
  {
    //Find weight text
    var weightText = document.querySelector(`.weight-text`)
    if(!weightText)
      return
    //Pull content
    var weight = e.target.value
    //Update text on the popup and it's button
    weightText.textContent = `Weight: ${weight}`;
    document.getElementById(`${selectedSong}`)?.setAttribute("value", weight);
    //If the weight currently doesn't exist,
    //if(!weights[currentPlaylistID])
    //  weights[currentPlaylistID] = {"noID" : 0};
    //Set weight in playlist, with selectedsong in global from event handler
    weights[currentPlaylistID][selectedSong] = weight
    //console.log(weights[currentPlaylistID])
    //Store in spicetify storage
    Spicetify.LocalStorage.set("weights", JSON.stringify(weights));
  })
}

//Second order function to return an event handler
function setSelectedSong(uri : string)
{
  return (e : any) => {
    selectedSong = uri
    console.log(`current song is now ${uri}`);
  }
}

async function addWeightSliders(playlistContents : any){
  //if the playlist isn't weighted, don't bother
  if(!weightedness[currentPlaylistID])
    return

  //if the playlist isn't sorted by custom order, the row indices won't work
  var sortingOrderTextContent = document.querySelector(".w6j_vX6SF5IxSXrrkYw5")?.querySelector(".main-type-mesto")?.textContent
  //console.log(sortingOrderTextContent)
  if(sortingOrderTextContent != 'Custom order')
  {
    //console.log('improperly sorted');
    return
  }
  //else
  //  console.log('properly sorted');

  /*
  row
   ->main-trackList-tracklistRow
     -> main-trackList-rowSectionStart
        -> insert at the end
  */

  //get playlist rows
  var playlistRows = playlistContents?.childNodes[1].childNodes
  //console.log(`filling ${playlistRows.length} rows`)

  for(let i = 0; i < playlistRows.length; i++)
  {
    //check if it already exists
    var count = playlistRows[i].firstChild?.childNodes[1].childNodes.length
    //console.log(`row ${i} has ${count} els`)
    if(count == undefined)
      continue;
    if(count >= 3)
    continue

    //pull uri
    var songIndex = playlistRows[i].getAttribute(`aria-rowindex`) - 2;
    if(!selectedPlaylistContents[songIndex])
    {
      console.log(`can't find song at index ${songIndex}`)
    }
    var uri = selectedPlaylistContents[songIndex].link.split(':')[2];

    var weightButton = htmlToElement(weightButtonTemplateString + `id="${uri}">`);
    if(!weightButton)
      continue;

    //add event listener for opening the weight popup, and to set the current song
    weightButton.addEventListener("click", setSelectedSong(uri))
    weightButton.addEventListener("click", openWeightSliderPopup)
    

    playlistRows[i].firstChild?.childNodes[1].appendChild(weightButton);

    //set the button's text to it's weight
    var button = document.getElementById(`${uri}`);
    if(button)
      button.setAttribute("value", `${weights[currentPlaylistID][uri]}`);
  }
}

async function removeWeightSliders()
{
  document.querySelectorAll(`.weight-slider-access-button`).forEach((item) => {
    item.remove();
  })
}

async function listenThenAddWeightSliders()
{
  //literally just wait a second
  await new Promise(r => setTimeout(r, 1000));

  //Grab the playlist content from spotify api
  currentPlaylistID = getCurrentPlaylistID()
  var uri = Spicetify.URI.fromString(`spotify:playlist:${currentPlaylistID}`);
  const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri.toString()}/rows`, {
            policy: { link: true },
        });
  selectedPlaylistContents = res.rows 

  //Grab the playlist content divs
  const playlistContents = document.querySelector("." + playlistContentClassName)?.querySelector("." + playlistContentClassNameDeeper)
  if(!playlistContents)
    return;

  var playlistRowsParent = playlistContents?.childNodes[1]
  while(!playlistRowsParent) {
    //console.log("waiting rows")
    playlistRowsParent = playlistContents?.childNodes[1]
    await new Promise(r => setTimeout(r, 100));
  }

  //put the sliders there initially
  addWeightSliders(playlistContents)

  //when the page changes, it should add sliders
  const observer = new MutationObserver(function appchange(){
    getCurrentPlaylistID()
    addWeightSliders(playlistContents)
  })
  observer.observe(playlistRowsParent,{ childList: true, subtree: true });
}

// Listen to page navigation and re-apply when DOM is ready
function listenThenApply(pathname: any) {
  const observer = new MutationObserver(function appchange(){
      // Look for the playlist action bar.
      const bar = document.querySelector('.main-actionBar-ActionBarRow');
      if(bar && pathname.includes("playlist"))
      {
        //console.log("i think a playlist is selected: " + pathname);

        //before anything else initialize weights so other things don't break
        getCurrentPlaylistID();
        initializeWeightsForPlaylist(currentPlaylistID);
        //add switches and sliders
        addWeightedSwitch();
        listenThenAddWeightSliders();
        observer.disconnect();
      }
      else
      {
        //console.log("i think a playlist is NOT selected.");
      }
  })
  // I need to include subtree because the Search page only has one child and the content is under there
  observer.observe(document,{ childList: true, subtree: true });
}

function pickNextSong(playlist: string)
{

  //pick song from weights
  var playlistWeights = weights[playlist];

  //sum weights
  var weightSum = 0;
  Object.entries(playlistWeights).forEach(
    ([key, value]) => {
      weightSum += Number(value)
    }
  );

  //roll from [0, sumWeights] and choose accordingly
  var roll = Math.random() * weightSum;
  //console.log(`Weight sum is ${weightSum} and rolled ${roll}`);
  var songResult;
  Object.entries(playlistWeights).forEach(
    ([key, value]) => {
      roll -= Number(value);
      //console.log(`roll is now ${roll} is ${roll <= 0}`)
      if(roll <= 0)
      {
        //console.log(`selecting ${key}`);
        songResult = key;
        roll = 1000000000;
        return;
      }
    }
  );
  return songResult;
}

async function main() {

  //Add settings 
  settings = new SettingsSection("Song Weighting", "song-weights");


  //min and max weight
  settings.addInput("min-weight", "Minimum Song Weight", "0.25");
  settings.addInput("max-weight", "Maximum Song Weight", "10");

  //apply
  settings.pushSettings();

  //clear weights for testing
  //Spicetify.LocalStorage.set("weightedness", JSON.stringify({}));
  //Spicetify.LocalStorage.set("weights", JSON.stringify({}));

  //pull weightedness and weights from localstorage
  var storedWeightedness = Spicetify.LocalStorage.get("weightedness")
    if(!storedWeightedness)
      Spicetify.LocalStorage.set("weightedness", JSON.stringify({}));
    else
      weightedness = JSON.parse(storedWeightedness);
  var storedWeights = Spicetify.LocalStorage.get("weights")
  if(!storedWeights)
  {
    storedWeights = JSON.stringify({});
    Spicetify.LocalStorage.set("weights", JSON.stringify({}));
  }
  weights = JSON.parse(storedWeights);

  //game.isLoaded()
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Initial scan on app load
  listenThenApply(Spicetify.Platform.History.location.pathname);

  //
  console.log(Spicetify.Platform.PlayerAPI.addToQueue)
  console.log(Spicetify.Platform.PlayerAPI._queue)
  //console.log(Spicetify.Player.origin._queue)

  // Listen for page navigation events
  Spicetify.Platform.History.listen(({ pathname } : any) => {
      listenThenApply(pathname);
  });


  //Establish modified playing
  var playerPlayOGFunc = Spicetify.Platform.PlayerAPI.play.bind(Spicetify.Platform.PlayerAPI);

  Spicetify.Player.addEventListener("songchange", (param: any) => {
    var provider = Spicetify.Platform.PlayerAPI._queue._state.nextTracks[0].provider
    console.log(`provider is ${provider}`)

    var context = Spicetify.Platform.PlayerAPI._state.context.uri
    console.log(`context is ${context}`) 
    if(context.includes("playlist"))
    {
      var playlistURI = context.split(':')[2];
      if(weightedness[playlistURI] === undefined || weightedness[playlistURI] === null)
      {
        console.log(`Playlist ${playlistURI} does not have an entry in weightedness.`)
        return;
      }
      else if(weightedness[playlistURI] === false)
      {
        console.log(`Playlist ${playlistURI} is unweighted`)
        return;
      }
      else
        console.log(`Playlist ${playlistURI} is weighted with weights ${weights[playlistURI]}`)

      //roll and choose
      var nextSong = pickNextSong(playlistURI);
      console.log(`Next song is : ${nextSong}`)

      //I literally don't know why this works but adding to queue by directly constructing the { uri: track } object does not, but so be it.
      var uris = [`spotify:track:${nextSong}`];
      //@ts-ignore -- VSCode does not accept that Player.origin exists
      setTimeout(() => { Spicetify.Player.origin._queue.addToQueue(uris.map(track => { return { uri: track } })) }, 100);
    }

    //Spicetify.Player.origin._queue.addToQueue(uris.map(track => { return { uri: track } }))
    //setTimeout(() => { Spicetify.Player.origin._queue.addToQueue({uri : "spotify:track:18cCBvygH6yEFDY0cYN3wT"});
  });
}

export default main;