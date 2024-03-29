import React from "react";
import { SettingsSection } from "spcr-settings";

//Class names from the spotify app
const actionBarFlexBoxClassName = "playlist-playlist-searchBoxContainer"; // name for  the space buffer - used to be KodyK77Gzjb8NqPGpcgw
const playlistContentClassName =  "main-rootlist-wrapper" // "rezqw3Q4OEPB1m4rmwfw";
const playlistContentClassNameDeeper = "JUa6JJNj7R_Y3i4P8YUX";
const playlistSortingClassName = "x-sortBox-sortDropdown"

//Template Strings 
const weightedSwitchTemplateString = `<label class="x-toggle-wrapper x-settings-secondColumn"><input id="weightedSwitch" class="x-toggle-input" type="checkbox"><span class="x-toggle-indicatorWrapper"><span class="x-toggle-indicator"></span></span></label>`;
const weightButtonTemplateString = `<input type="button" class="weight-slider-access-button" value="Weight" style="background-color:#121212;"`;
const weightSliderPopupTemplateString = `<div class="weight-slider-popup" style="z-index: 10000; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(200px, 200px); background-color:Tomato; border-radius: 10px;"> <p>Weight: </p> <div class="slidecontainer"> <input type="range" min="0.01" max="100" value="1" class="slider" id="myRange"> </div> </div>`;
const exportButtonTemplateString = `<input type="button" class="weight-export-button" value="Export Weights" style="background-color:#121212;"`;
const importButtonTemplateString = `<input type="button" class="weight-import-button" value="Import Weights" style="background-color:#121212;"`;

const importPopupContentDivStyle = `
display: flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content: center;`
const importPopupTextareaTemplateString = `<textarea  cols="30" rows="10" class="import-weight-textarea" style = "
inset: 0px auto auto 0px; 
margin: 0px;
"
></textarea>`

const importPopupButtonTemplateString = `<input type="button" class="weight-import-button" value="Import Weights" style = "
    inset: 0px auto auto 0px; 
">`

//Const names
const weightedSwitchName = "weightedSwitch";
const weightedSwitchSearch = "#weightedSwitch";

//Data Globals
let settings : SettingsSection;
let weightedness : {[id:string]: boolean} = {};
let weights : {[playlistId:string] : {[songId:string]: number}} = {};

//Misc Globals
let currentPlaylistID : any;
let selectedSong = "";
let selectedPlaylistContents : any;
let lastAdded = "noID";
let lastPlaylist = "noID";

//Helper Functions
function htmlToElement(html: string) {
  let template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  if(!template.content.firstChild)
    throw new ReferenceError("Failed to create element: " + html);
  return template.content.firstChild;
}

function getCurrentPlaylistID()
{
  //Check if currently on some sort of playable thing (has the action bar w/ the play button)
  const bar = document.querySelector('.main-actionBar-ActionBarRow');
  //Find pathname from DOM loc
  const pathname : string = Spicetify.Platform.History.location.pathname;
  //if it's a playlist
  if(bar && pathname.includes("playlist"))
  {
    //console.log("Pulling playlist ID from: " + pathname);
    let id = pathname.substring(10, pathname.length);
    currentPlaylistID = id;
    return id;
  }
  else
  {
    return "noID";
  }
}

//Actual Functionality

//Weighted switch event listener to save ids
async function toggleWeightedness(e : any)
{
  //find playlist id, toggle it's weightedness in the weightedness array
  let id = getCurrentPlaylistID();
  weightedness[id] = e.target.checked;
  console.log("Weighted: " + e.target.checked + " for " + id + " full weightedness: " + JSON.stringify(weightedness));

  //store in localstorage
  Spicetify.LocalStorage.set("weightedness", JSON.stringify(weightedness));

  //if toggled on, add weight sliders
  if(weightedness[id])
  {
    initializeWeightsForPlaylist(id);
    let contents = await getPlaylistContents()
    addWeightSliders(contents);
    addExportButton();
    addImportButton();
  }
  else
  {
    removeWeightSliders();
    document.querySelector(".weight-export-button")?.remove();
    document.querySelector(".weight-import-button")?.remove();
  }
}

//Create weighted switch
async function addWeightedSwitch()
{
  //if it already exists on the page, don't add another
  if(document.querySelector("#" + weightedSwitchName))
    return;

  //Reference Action Bar
  let playlistActionBar = document.querySelector(".main-actionBar-ActionBarRow");

  //Generate switch from template string
  let testSwitch = htmlToElement(weightedSwitchTemplateString);

  //Find the flex box next to the buttons on the playlist bar - now has a real name, reflected in variable
  let spaceBuffer = document.querySelector("." + actionBarFlexBoxClassName);
  let addedSwitch = playlistActionBar?.insertBefore(testSwitch, spaceBuffer);

  //Initialize value from weightedness
  let thisWeightedness = weightedness[getCurrentPlaylistID()];
  if(thisWeightedness === undefined)
    thisWeightedness = false;

  //for some reason it's not set it to false, must remove to turn it off
  if(thisWeightedness)
    document.querySelector(weightedSwitchSearch)?.setAttribute("checked", '');
  else
    document.querySelector(weightedSwitchSearch)?.removeAttribute("checked");

  //Add event listener to the added switch
  addedSwitch?.addEventListener('input', toggleWeightedness);

  //add export button if this playlist is weighted
  if(thisWeightedness)
  {
    addExportButton();
    addImportButton();
  }
}

// 
async function addExportButton()
{
    console.log("Adding Export Button.");
    //if it already exists on the page, don't add another
    if(document.querySelector(".weight-export-button"))
      return;

    //Reference Action Bar
    let playlistActionBar = document.querySelector(".main-actionBar-ActionBarRow");

    //Find the flex box next to the buttons on the playlist bar which for some reason has the name "KodyK77Gzjb8NqPGpcgw" (very well might change with update)
    let spaceBuffer = document.querySelector("." + actionBarFlexBoxClassName);

    //Add export button
    let exportButton = htmlToElement(exportButtonTemplateString  + `id="${getCurrentPlaylistID()}">`);

    let addedExportButton = playlistActionBar?.insertBefore(exportButton, spaceBuffer);

    addedExportButton?.addEventListener('click', exportWeights)
}

async function addImportButton()
{
    console.log("Adding Import Button.");
    //if it already exists on the page, don't add another
    if(document.querySelector(".weight-import-button"))
      return;

    //Reference Action Bar
    let playlistActionBar = document.querySelector(".main-actionBar-ActionBarRow");

    //Find the flex box next to the buttons on the playlist bar which for some reason has the name "KodyK77Gzjb8NqPGpcgw" (very well might change with update)
    let spaceBuffer = document.querySelector("." + actionBarFlexBoxClassName);

    //Add import button
    let importButton = htmlToElement(importButtonTemplateString  + `id="${getCurrentPlaylistID()}">`);
    let addedimportButton = playlistActionBar?.insertBefore(importButton, spaceBuffer);

    addedimportButton?.addEventListener('click', importWeightsPopup)
}

async function importWeightsPopup()
{
  let content = document.createElement("div");
  content.id = "popup-config-container";
  content.setAttribute('style', importPopupContentDivStyle); 

  let textarea = htmlToElement(importPopupTextareaTemplateString);
  let button = htmlToElement(importPopupButtonTemplateString);
  button?.addEventListener('click', importWeights)
  
  content.append(textarea, button);

  Spicetify.PopupModal.display({
    title: "Weight Import",
    content: content,
  });
}

async function importWeights()
{
  //0. pull imported text string / update vars
  let textarea = document.querySelector(`.import-weight-textarea`) as HTMLInputElement;
  let importString = textarea?.value;
  let playlistId = getCurrentPlaylistID();

  //1. clear existing weights
  weights[currentPlaylistID] = {};

  //2. find what songs this playlist has in it
  let songs = "";
  for(let i = 0; i < selectedPlaylistContents.length; i++)
  {
    let songId = selectedPlaylistContents[i].link.split(':')[2];
    songs += songId;
    songs += ',';
  }
  console.log(songs);

  //3. re-initialize weights for this playlist
  initializeWeightsForPlaylist(currentPlaylistID);

  //4. for each imported song, if it's on this playlist, set the weight
  let entries = importString.split('|')
  entries.forEach(entry =>{
    let entryContent = entry.split(':');
    let id = entryContent[0];
    let weight = Number(entryContent[1]);

    if(songs.includes(id))
    {
      weights[currentPlaylistID][id] = weight;
      console.log("Setting weight for " + id + " to " + weight);
    }
    else
    {
      console.log("This playlist does not have song " + id + " on it!");
    }

  });

  //5. update local storage
  Spicetify.LocalStorage.set("weights", JSON.stringify(weights));

  //6. reinit ui
  removeWeightSliders();
  const playlistContents = await getPlaylistContents(); //document.querySelector("." + playlistContentClassName)?.querySelector("." + playlistContentClassNameDeeper);
  addWeightSliders(playlistContents);

  Spicetify.PopupModal.hide();

  Spicetify.showNotification("Weights Imported! You might need to refresh the playlist to see them applied.");
}

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text : string) {
  let textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    Spicetify.showNotification("Weights Copied To Clipboard!");
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

async function exportWeights()
{
  console.log("Exporting weights to clipboard.")
  let weightsString = "";
  let playlist = getCurrentPlaylistID();
  let playlistWeights = weights[playlist];
  Object.entries(playlistWeights).forEach(
    ([key, value]) => {
      weightsString = weightsString.concat(key, ":", value.toString(), "|");
    }
  );
  copyTextToClipboard(weightsString.slice(0, -1)); // take the last '|' character off
}

async function getPlaylistContents() : Promise<Element>
{
  //used to be this - document.querySelector("." + playlistContentClassName)?.querySelector("." + playlistContentClassNameDeeper);

  //is now
  var ret;
  do {
    ret = document.querySelector(".playlist-playlist-playlistContent")?.querySelector(".main-rootlist-wrapper")
  } while(!ret);

  console.log("Playlist contents:")
  console.log(ret);
  return ret;
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
`;

async function initializeWeightsForPlaylist(id: string)
{
  //if this playlist already has weights, don't redo it.
  if(weights[id])
    return;

  //Grab the playlist content from spotify api
  let uri = Spicetify.URI.fromString(`spotify:playlist:${id}`);
  const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri.toString()}/rows`, {
            policy: { link: true },
        });
  selectedPlaylistContents = res.rows;

  console.log(res);

  //set weights[id] to blank
  weights[id] = {};

  //fill in each song to have default weight of 1
  for(let i = 0; i < selectedPlaylistContents.length; i++)
  {
    let songId = selectedPlaylistContents[i].link.split(':')[2];
    weights[id][songId] = 1;
    //console.log(`setting ${songId}`);
  }
}

//Function to create the weight slider popup window
async function openWeightSliderPopup(e : any)
{
  //grab variables and insert them into string
  let x = e.x;
  let y = e.y;

  //stick into style attribute
  let popupPositioningStyleString = `transform: translate(${x}px, ${y}px)`;

  //Create the element
  let popup = htmlToElement(weightSliderPopupString);

  //if it already exists, remove it
  document.querySelector(`.weight-slider-popup`)?.remove();

  //add popup to window
  let popupNode = document.querySelector("body")?.appendChild(popup);

  //set its position with style string
  document.querySelector(`.weight-slider-popup`)?.setAttribute("style", popupPositioningStyleString);

  //make it draggable
  dragElement(document.querySelector(`.weight-slider-popup`));

  //display current weight
  let initialWeightText = document.querySelector(`.weight-text`);
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
    document.querySelector(`.weight-slider-popup`)?.remove();
  })

  //set min, max, and current value on slider
  let slider = document.querySelector(`.weight-slider`);
  slider?.setAttribute("min", settings.getFieldValue("min-weight"));
  slider?.setAttribute("max", settings.getFieldValue("max-weight"));
  slider?.setAttribute("value", weights[currentPlaylistID][selectedSong].toString());
  
  //weight change
  document.querySelector(`.weight-slider`)?.addEventListener(`input`, function(e : any)
  {
    //Find weight text
    let weightText = document.querySelector(`.weight-text`);
    if(!weightText)
      return;
    //Pull content
    let weight = e.target.value;

    //Update text on the popup and it's button
    weightText.textContent = `Weight: ${weight}`;
    document.getElementById(`${selectedSong}`)?.setAttribute("value", weight);

    //Set weight in playlist, with selectedsong in global from event handler
    weights[currentPlaylistID][selectedSong] = weight;
    //Store in spicetify storage
    Spicetify.LocalStorage.set("weights", JSON.stringify(weights));
  })
}

//Second order function to return an event handler
function setSelectedSong(uri : string)
{
  return (e : any) => {
    selectedSong = uri;
    console.log(`current song is now ${uri}`);
  }
}

async function addWeightSliders(playlistContents : any){
  //if the playlist isn't weighted, don't bother
  if(!weightedness[currentPlaylistID])
    return;

  //if the playlist isn't sorted by custom order, the row indices won't work
  let sortingOrderTextContent = document.querySelector("." + playlistSortingClassName)?.firstChild?.textContent //?.querySelector(".main-type-mesto")?.textContent;
  if(sortingOrderTextContent != 'Custom order')
  {
    return;
  }

  /*
  row
   ->main-trackList-tracklistRow
     -> main-trackList-rowSectionStart
        -> insert at the end
  */

  //update contents
  updatePlaylistContents();
  // while the playlist has nothing in it,  wait
  while (selectedPlaylistContents.length == 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }


  //get playlist rows
  let playlistRows = playlistContents?.childNodes[1].childNodes;

  //console.log(`filling ${playlistRows.length} rows`)

  console.log(weights[currentPlaylistID])

  for(let i = 0; i < playlistRows.length; i++)
  {
    //check if it already exists
    let count = playlistRows[i].firstChild?.childNodes[1].childNodes.length;
    if(count == undefined)
      continue;
    if(count >= 3)
      continue;

    //pull uri
    let songIndex = playlistRows[i].getAttribute(`aria-rowindex`) - 2;
    if(!selectedPlaylistContents[songIndex])
    {
      console.log(`can't find song at index ${songIndex}`);
    }
    let uri = selectedPlaylistContents[songIndex].link.split(':')[2];

    let weightButton = htmlToElement(weightButtonTemplateString + `id="${uri}">`);

    //add event listener for opening the weight popup, and to set the current song
    weightButton.addEventListener("click", setSelectedSong(uri));
    weightButton.addEventListener("click", openWeightSliderPopup);
    
    //add weight button
    playlistRows[i].firstChild?.childNodes[1].appendChild(weightButton);

    //if for some reason, weight is undef. set it to 1
    if(weights[currentPlaylistID][uri] == undefined)
    {
      console.log("Weight for " + uri + " is undefined!");
      weights[currentPlaylistID][uri] = 1;
    }

    //set the button's text to it's weight
    let button = document.getElementById(`${uri}`);
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

async function updatePlaylistContents()
{
  currentPlaylistID = getCurrentPlaylistID();
  let uri = Spicetify.URI.fromString(`spotify:playlist:${currentPlaylistID}`);
  const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri.toString()}/rows`, {
            policy: { link: true },
        });
  selectedPlaylistContents = res.rows;
}

async function listenThenAddWeightSliders()
{
  //literally just wait a second
  await new Promise(r => setTimeout(r, 1000));

  //Grab the playlist content from spotify api
  await updatePlaylistContents();

  //Grab the playlist content divs
  const playlistContents = await getPlaylistContents(); //document.querySelector("." + playlistContentClassName)?.querySelector("." + playlistContentClassNameDeeper);
  if(!playlistContents)
    return;

  let playlistRowsParent = playlistContents?.childNodes[1]
  while(!playlistRowsParent) {
    //console.log("waiting rows")
    playlistRowsParent = playlistContents?.childNodes[1]
    await new Promise(r => setTimeout(r, 100));
  }

  //put the sliders there initially
  addWeightSliders(playlistContents);

  //when the page changes, it should add sliders
  const observer = new MutationObserver(function appchange(){
    getCurrentPlaylistID();
    addWeightSliders(playlistContents);
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
  let playlistWeights = weights[playlist];

  //sum weights
  let weightSum = 0;
  Object.entries(playlistWeights).forEach(
    ([key, value]) => {
      weightSum += Number(value)
    }
  );

  //roll from [0, sumWeights] and choose accordingly
  let roll = Math.random() * weightSum;
  //console.log(`Weight sum is ${weightSum} and rolled ${roll}`);
  let songResult;
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

function rollAndAdd(playlistURI : string){
  //roll and choose
  let nextSong = pickNextSong(playlistURI);
  console.log(`Next song is : ${nextSong}`);
  //I literally don't know why this works but adding to queue by directly constructing the { uri: track } object does not, but so be it.
  let uris = [`spotify:track:${nextSong}`];
  //@ts-ignore -- VSCode does not accept that Player.origin exists
  setTimeout(() => { Spicetify.Player.origin._queue.addToQueue(uris.map(track => { return { uri: track } })) }, 100);
  //Store what was just picked
  lastAdded = uris[0];
}

async function removeFromQueue(index : number)
{
  let nextTrack = Spicetify.Platform.PlayerAPI._queue._queue.nextTracks[index];
  let uid = nextTrack.contextTrack.uid;
  let uri = nextTrack.contextTrack.uri;
  let nextTrackObj = {uid, uri};
  let nextTrackArr : any = [];
  nextTrackArr[0] = nextTrackObj;
  console.log(nextTrackArr);
  //@ts-ignore
  await new Promise(p => {setTimeout(() => { Spicetify.Player.origin._queue.removeFromQueue(nextTrackArr) }, 300) } );
}

async function onSongChange(){
  //wait a tiny little bit before doing anything for the playing context to properly update
  await new Promise(r => setTimeout(r, 250));

  //Get playing context
  let context = Spicetify.Platform.PlayerAPI._state.context.uri;
  let playlistURI = context.split(':')[2];
  let provider = Spicetify.Platform.PlayerAPI._queue._queue.nextTracks[0].provider;
  let nextProvider = Spicetify.Platform.PlayerAPI._queue._queue.nextTracks[1].provider;
  let farProvider =  Spicetify.Platform.PlayerAPI._queue._queue.nextTracks[2].provider;
  let nextTrackID = Spicetify.Platform.PlayerAPI._queue._queue.nextTracks[0].contextTrack.uri;
  //console.log(`context is ${context} with lastPlaylist ${lastPlaylist}`);

  //Check for playlist change
  if(playlistURI != lastPlaylist)
  {
    //console.log("Playlist change!")
    lastPlaylist = playlistURI;

    //Switching playlists will add a song to queue, but it shouldn't! If there's already a queue, however, don't interfere with it.
    if(farProvider == "queue")
    {
      //console.log("Far provider is queue, returning.")
      return;
    }

    //Remove the 0th song from queue
    removeFromQueue(0);
  }
  
  //if there's already a queue, don't interfere with it.
  if(nextProvider == "queue")
  {
    console.log("Next is from queue - Not interfering with the queue.");
    return;
  }
  if(provider == "queue" && nextTrackID != lastAdded)
  {
    console.log("Not interfering with the queue.");
    return;
  }
  
  if(context.includes("playlist"))
  {
    //Store last playlist to handle playlist changes
    if(lastPlaylist != playlistURI)
      console.log("Playlist Change!");
    lastPlaylist = playlistURI;

    if(weightedness[playlistURI] === undefined || weightedness[playlistURI] === null)
    {
      console.log(`Playlist ${playlistURI} does not have an entry in weightedness.`);
      return;
    }
    else if(weightedness[playlistURI] === false)
    {
      console.log(`Playlist ${playlistURI} is unweighted`);
      return;
    }
    else
      console.log(`Playlist ${playlistURI} is weighted with weights ${weights[playlistURI]}`);

    rollAndAdd(playlistURI);
  }
}

function dragElement(elmnt : any) {
  let oldmousemove = document.onmousemove;
  let oldmouseup = document.onmouseup;

  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e : any) {
    e = e || window.event;

    //don't move while touching slider
    if(e.path[0].className == "weight-slider")
    {
      return;
    }
    //e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e : any) {
    e = e || window.event;
    //e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = oldmouseup;
    document.onmousemove = oldmousemove;
  }
}

async function main() {
  //Add settings 
  settings = new SettingsSection("Song Weighting", "song-weights");

  //min and max weight
  settings.addInput("min-weight", "Minimum Song Weight", "0.25");
  settings.addInput("max-weight", "Maximum Song Weight", "10");
  //settings.addInput("export-path", "Export Path", "")

  //apply
  settings.pushSettings();

  //pull weightedness and weights from localstorage
  let storedWeightedness = Spicetify.LocalStorage.get("weightedness")
    if(!storedWeightedness)
      Spicetify.LocalStorage.set("weightedness", JSON.stringify({}));
    else
      weightedness = JSON.parse(storedWeightedness);
  let storedWeights = Spicetify.LocalStorage.get("weights");
  if(!storedWeights)
  {
    storedWeights = JSON.stringify({});
    Spicetify.LocalStorage.set("weights", JSON.stringify({}));
  }
  weights = JSON.parse(storedWeights);

  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Initial scan on app load
  listenThenApply(Spicetify.Platform.History.location.pathname);

  // Listen for page navigation events
  Spicetify.Platform.History.listen(({ pathname } : any) => {
      listenThenApply(pathname);
  });

  //Establish modified playing
  //let playerPlayOGFunc = Spicetify.Platform.PlayerAPI.play.bind(Spicetify.Platform.PlayerAPI);
  Spicetify.Player.addEventListener("songchange", onSongChange);

}

export default main;