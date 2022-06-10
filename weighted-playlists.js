var weightedDplaylists = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
if (x === "react") return Spicetify.React;
if (x === "react-dom") return Spicetify.ReactDOM;
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/spcr-settings/settingsSection.tsx
  var import_react = __toESM(__require("react"));
  var import_react_dom = __toESM(__require("react-dom"));

  // postcss-module:C:\Users\Matt\AppData\Local\Temp\tmp-32404-nvXNf8Ew26ii\1814c03d6390\settings.module.css
  var settings_module_default = { "settingsContainer": "settings-module__settingsContainer___e9wxn_weightedDplaylists", "heading": "settings-module__heading___AnER-_weightedDplaylists", "description": "settings-module__description___dP4fR_weightedDplaylists", "inputWrapper": "settings-module__inputWrapper___LgOrw_weightedDplaylists" };

  // node_modules/spcr-settings/settingsSection.tsx
  var SettingsSection = class {
    constructor(name, settingsId, initialSettingsFields = {}) {
      this.name = name;
      this.settingsId = settingsId;
      this.initialSettingsFields = initialSettingsFields;
      this.settingsFields = this.initialSettingsFields;
      this.setRerender = null;
      this.buttonClassnames = null;
      this.pushSettings = async () => {
        Object.entries(this.settingsFields).forEach(([nameId, field]) => {
          if (field.type !== "button" && this.getFieldValue(nameId) === void 0) {
            this.setFieldValue(nameId, field.defaultValue);
          }
        });
        while (!Spicetify?.Platform?.History?.listen) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (this.stopHistoryListener)
          this.stopHistoryListener();
        this.stopHistoryListener = Spicetify.Platform.History.listen((e) => {
          if (e.pathname === "/preferences") {
            this.render();
          }
        });
        if (Spicetify.Platform.History.location.pathname === "/preferences") {
          await this.render();
        }
      };
      this.rerender = () => {
        if (this.setRerender) {
          this.setRerender(Math.random());
        }
      };
      this.render = async () => {
        while (!document.getElementById("desktop.settings.selectLanguage")) {
          if (Spicetify.Platform.History.location.pathname !== "/preferences")
            return;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        const allSettingsContainer = document.querySelector(".main-view-container__scroll-node-child main div");
        if (!allSettingsContainer)
          return console.error("[spcr-settings] settings container not found");
        this.buttonClassnames = Array.from(allSettingsContainer.querySelectorAll(":scope > button")).at(-1)?.className ?? null;
        let pluginSettingsContainer = Array.from(allSettingsContainer.children).find((child) => child.id === this.settingsId);
        if (!pluginSettingsContainer) {
          pluginSettingsContainer = document.createElement("div");
          pluginSettingsContainer.id = this.settingsId;
          pluginSettingsContainer.className = settings_module_default.settingsContainer;
          allSettingsContainer.appendChild(pluginSettingsContainer);
        } else {
          console.log(pluginSettingsContainer);
        }
        import_react_dom.default.render(/* @__PURE__ */ import_react.default.createElement(this.FieldsContainer, null), pluginSettingsContainer);
      };
      this.addButton = (nameId, description, value, onClick, events) => {
        this.settingsFields[nameId] = {
          type: "button",
          description,
          value,
          events: {
            onClick,
            ...events
          }
        };
      };
      this.addInput = (nameId, description, defaultValue, onChange, events) => {
        this.settingsFields[nameId] = {
          type: "input",
          description,
          defaultValue,
          events: {
            onChange,
            ...events
          }
        };
      };
      this.addHidden = (nameId, defaultValue) => {
        this.settingsFields[nameId] = {
          type: "hidden",
          defaultValue
        };
      };
      this.addToggle = (nameId, description, defaultValue, onChange, events) => {
        this.settingsFields[nameId] = {
          type: "toggle",
          description,
          defaultValue,
          events: {
            onChange,
            ...events
          }
        };
      };
      this.addDropDown = (nameId, description, options, defaultIndex, onSelect, events) => {
        this.settingsFields[nameId] = {
          type: "dropdown",
          description,
          defaultValue: options[defaultIndex],
          options,
          events: {
            onSelect,
            ...events
          }
        };
      };
      this.getFieldValue = (nameId) => {
        return JSON.parse(Spicetify.LocalStorage.get(`${this.settingsId}.${nameId}`) || "{}")?.value;
      };
      this.setFieldValue = (nameId, newValue) => {
        Spicetify.LocalStorage.set(`${this.settingsId}.${nameId}`, JSON.stringify({ value: newValue }));
      };
      this.FieldsContainer = () => {
        const [rerender, setRerender] = (0, import_react.useState)(0);
        this.setRerender = setRerender;
        return /* @__PURE__ */ import_react.default.createElement("div", {
          className: settings_module_default.settingsContainer,
          key: rerender
        }, /* @__PURE__ */ import_react.default.createElement("h2", {
          className: ["main-shelf-title main-type-cello", settings_module_default.heading].join(" ")
        }, this.name), Object.entries(this.settingsFields).map(([nameId, field]) => {
          return /* @__PURE__ */ import_react.default.createElement(this.Field, {
            nameId,
            field
          });
        }));
      };
      this.Field = (props) => {
        const id = `${this.settingsId}.${props.nameId}`;
        let defaultStateValue;
        if (props.field.type === "button") {
          defaultStateValue = props.field.value;
        } else {
          defaultStateValue = this.getFieldValue(props.nameId);
        }
        if (props.field.type === "hidden") {
          return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null);
        }
        const [value, setValueState] = (0, import_react.useState)(defaultStateValue);
        const setValue = (newValue) => {
          if (newValue !== void 0) {
            setValueState(newValue);
            this.setFieldValue(props.nameId, newValue);
          }
        };
        return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
          className: "main-type-mesto",
          style: { color: "var(--spice-subtext)" }
        }, /* @__PURE__ */ import_react.default.createElement("label", {
          className: settings_module_default.description,
          htmlFor: id
        }, props.field.description || "")), /* @__PURE__ */ import_react.default.createElement("span", {
          className: ["x-settings-secondColumn", settings_module_default.inputWrapper].join(" ")
        }, props.field.type === "input" ? /* @__PURE__ */ import_react.default.createElement("input", {
          className: "main-dropDown-dropDown",
          id,
          dir: "ltr",
          value,
          type: "text",
          ...props.field.events,
          onChange: (e) => {
            setValue(e.currentTarget.value);
            const onChange = props.field.events?.onChange;
            if (onChange)
              onChange(e);
          }
        }) : props.field.type === "button" ? /* @__PURE__ */ import_react.default.createElement("span", {
          className: ""
        }, /* @__PURE__ */ import_react.default.createElement("button", {
          id,
          className: this.buttonClassnames ?? "",
          ...props.field.events,
          onClick: (e) => {
            setValue();
            const onClick = props.field.events?.onClick;
            if (onClick)
              onClick(e);
          },
          type: "button"
        }, value)) : props.field.type === "toggle" ? /* @__PURE__ */ import_react.default.createElement("label", {
          className: "x-toggle-wrapper x-settings-secondColumn"
        }, /* @__PURE__ */ import_react.default.createElement("input", {
          id,
          className: "x-toggle-input",
          type: "checkbox",
          checked: value,
          ...props.field.events,
          onClick: (e) => {
            setValue(e.currentTarget.checked);
            const onClick = props.field.events?.onClick;
            if (onClick)
              onClick(e);
          }
        }), /* @__PURE__ */ import_react.default.createElement("span", {
          className: "x-toggle-indicatorWrapper"
        }, /* @__PURE__ */ import_react.default.createElement("span", {
          className: "x-toggle-indicator"
        }))) : props.field.type === "dropdown" ? /* @__PURE__ */ import_react.default.createElement("select", {
          className: "main-dropDown-dropDown",
          id,
          ...props.field.events,
          onChange: (e) => {
            setValue(props.field.options[e.currentTarget.selectedIndex]);
            const onChange = props.field.events?.onChange;
            if (onChange)
              onChange(e);
          }
        }, props.field.options.map((option, i) => {
          return /* @__PURE__ */ import_react.default.createElement("option", {
            selected: option === value,
            value: i + 1
          }, option);
        })) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null)));
      };
    }
  };

  // src/app.tsx
  var playlistContentClassName = "rezqw3Q4OEPB1m4rmwfw";
  var playlistContentClassNameDeeper = "JUa6JJNj7R_Y3i4P8YUX";
  var weightedSwitchTemplateString = `<label class="x-toggle-wrapper x-settings-secondColumn"><input id="weightedSwitch" class="x-toggle-input" type="checkbox"><span class="x-toggle-indicatorWrapper"><span class="x-toggle-indicator"></span></span></label>`;
  var weightButtonTemplateString = `<input type="button" class="weight-slider-access-button" value="Weight" style="background-color:#121212;"`;
  var exportButtonTemplateString = `<input type="button" class="weight-export-button" value="Export Weights" style="background-color:#121212;"`;
  var importButtonTemplateString = `<input type="button" class="weight-import-button" value="Import Weights" style="background-color:#121212;"`;
  var importPopupContentDivStyle = `
display: flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content: center;`;
  var importPopupTextareaTemplateString = `<textarea  cols="30" rows="10" class="import-weight-textarea" style = "
inset: 0px auto auto 0px; 
margin: 0px;
"
></textarea>`;
  var importPopupButtonTemplateString = `<input type="button" class="weight-import-button" value="Import Weights" style = "
    inset: 0px auto auto 0px; 
">`;
  var weightedSwitchName = "weightedSwitch";
  var weightedSwitchSearch = "#weightedSwitch";
  var settings;
  var weightedness = {};
  var weights = {};
  var currentPlaylistID;
  var selectedSong = "";
  var selectedPlaylistContents;
  var lastAdded = "noID";
  var lastPlaylist = "noID";
  function htmlToElement(html) {
    let template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    if (!template.content.firstChild)
      throw new ReferenceError("Failed to create element: " + html);
    return template.content.firstChild;
  }
  function getCurrentPlaylistID() {
    const bar = document.querySelector(".main-actionBar-ActionBarRow");
    const pathname = Spicetify.Platform.History.location.pathname;
    if (bar && pathname.includes("playlist")) {
      let id = pathname.substring(10, pathname.length);
      currentPlaylistID = id;
      return id;
    } else {
      return "noID";
    }
  }
  function toggleWeightedness(e) {
    var _a, _b, _c;
    let id = getCurrentPlaylistID();
    weightedness[id] = e.target.checked;
    console.log("Weighted: " + e.target.checked + " for " + id + " full weightedness: " + JSON.stringify(weightedness));
    Spicetify.LocalStorage.set("weightedness", JSON.stringify(weightedness));
    if (weightedness[id]) {
      addWeightSliders((_a = document.querySelector("." + playlistContentClassName)) == null ? void 0 : _a.querySelector("." + playlistContentClassNameDeeper));
      addExportButton();
      addImportButton();
    } else {
      removeWeightSliders();
      (_b = document.querySelector(".weight-export-button")) == null ? void 0 : _b.remove();
      (_c = document.querySelector(".weight-import-button")) == null ? void 0 : _c.remove();
    }
  }
  async function addWeightedSwitch() {
    var _a, _b;
    if (document.querySelector("#" + weightedSwitchName))
      return;
    let playlistActionBar = document.querySelector(".main-actionBar-ActionBarRow");
    let testSwitch = htmlToElement(weightedSwitchTemplateString);
    let spaceBuffer = document.querySelector(".KodyK77Gzjb8NqPGpcgw");
    let addedSwitch = playlistActionBar == null ? void 0 : playlistActionBar.insertBefore(testSwitch, spaceBuffer);
    let thisWeightedness = weightedness[getCurrentPlaylistID()];
    if (thisWeightedness === void 0)
      thisWeightedness = false;
    if (thisWeightedness)
      (_a = document.querySelector(weightedSwitchSearch)) == null ? void 0 : _a.setAttribute("checked", "");
    else
      (_b = document.querySelector(weightedSwitchSearch)) == null ? void 0 : _b.removeAttribute("checked");
    addedSwitch == null ? void 0 : addedSwitch.addEventListener("input", toggleWeightedness);
    if (thisWeightedness) {
      addExportButton();
      addImportButton();
    }
  }
  async function addExportButton() {
    console.log("Adding Export Button.");
    if (document.querySelector(".weight-export-button"))
      return;
    let playlistActionBar = document.querySelector(".main-actionBar-ActionBarRow");
    let spaceBuffer = document.querySelector(".KodyK77Gzjb8NqPGpcgw");
    let exportButton = htmlToElement(exportButtonTemplateString + `id="${getCurrentPlaylistID()}">`);
    let addedExportButton = playlistActionBar == null ? void 0 : playlistActionBar.insertBefore(exportButton, spaceBuffer);
    addedExportButton == null ? void 0 : addedExportButton.addEventListener("click", exportWeights);
  }
  async function addImportButton() {
    console.log("Adding Import Button.");
    if (document.querySelector(".weight-import-button"))
      return;
    let playlistActionBar = document.querySelector(".main-actionBar-ActionBarRow");
    let spaceBuffer = document.querySelector(".KodyK77Gzjb8NqPGpcgw");
    let importButton = htmlToElement(importButtonTemplateString + `id="${getCurrentPlaylistID()}">`);
    let addedimportButton = playlistActionBar == null ? void 0 : playlistActionBar.insertBefore(importButton, spaceBuffer);
    addedimportButton == null ? void 0 : addedimportButton.addEventListener("click", importWeightsPopup);
  }
  async function importWeightsPopup() {
    let content = document.createElement("div");
    content.id = "popup-config-container";
    content.setAttribute("style", importPopupContentDivStyle);
    let textarea = htmlToElement(importPopupTextareaTemplateString);
    let button = htmlToElement(importPopupButtonTemplateString);
    button == null ? void 0 : button.addEventListener("click", importWeights);
    content.append(textarea, button);
    Spicetify.PopupModal.display({
      title: "Weight Import",
      content
    });
  }
  async function importWeights() {
    var _a;
    let textarea = document.querySelector(`.import-weight-textarea`);
    let importString = textarea == null ? void 0 : textarea.value;
    let playlistId = getCurrentPlaylistID();
    let entries = importString.split("|");
    entries.forEach((entry) => {
      let entryContent = entry.split(":");
      let id = entryContent[0];
      let weight = Number(entryContent[1]);
      weights[currentPlaylistID][id] = weight;
      console.log("Setting weight for " + id + " to " + weight);
    });
    Spicetify.LocalStorage.set("weights", JSON.stringify(weights));
    removeWeightSliders();
    const playlistContents = (_a = document.querySelector("." + playlistContentClassName)) == null ? void 0 : _a.querySelector("." + playlistContentClassNameDeeper);
    addWeightSliders(playlistContents);
    Spicetify.PopupModal.hide();
    Spicetify.showNotification("Weights Imported! You might need to refresh the playlist to see them applied.");
  }
  function copyTextToClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      Spicetify.showNotification("Weights Copied To Clipboard!");
    } catch (err) {
      console.log("Oops, unable to copy");
    }
    document.body.removeChild(textArea);
  }
  async function exportWeights() {
    console.log("Exporting weights to clipboard.");
    let weightsString = "";
    let playlist = getCurrentPlaylistID();
    let playlistWeights = weights[playlist];
    Object.entries(playlistWeights).forEach(([key, value]) => {
      weightsString = weightsString.concat(key, ":", value.toString(), "|");
    });
    copyTextToClipboard(weightsString.slice(0, -1));
  }
  var weightSliderPopupString = `
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
  async function initializeWeightsForPlaylist(id) {
    if (weights[id])
      return;
    let uri = Spicetify.URI.fromString(`spotify:playlist:${id}`);
    const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri.toString()}/rows`, {
      policy: { link: true }
    });
    selectedPlaylistContents = res.rows;
    weights[id] = {};
    for (let i = 0; i < selectedPlaylistContents.length; i++) {
      let songId = selectedPlaylistContents[i].link.split(":")[2];
      weights[id][songId] = 1;
    }
  }
  async function openWeightSliderPopup(e) {
    var _a, _b, _c, _d, _e;
    let x = e.x;
    let y = e.y;
    let popupPositioningStyleString = `transform: translate(${x}px, ${y}px)`;
    let popup = htmlToElement(weightSliderPopupString);
    (_a = document.querySelector(`.weight-slider-popup`)) == null ? void 0 : _a.remove();
    let popupNode = (_b = document.querySelector("body")) == null ? void 0 : _b.appendChild(popup);
    (_c = document.querySelector(`.weight-slider-popup`)) == null ? void 0 : _c.setAttribute("style", popupPositioningStyleString);
    dragElement(document.querySelector(`.weight-slider-popup`));
    let initialWeightText = document.querySelector(`.weight-text`);
    if (!initialWeightText)
      return;
    if (!weights[currentPlaylistID][selectedSong])
      weights[currentPlaylistID][selectedSong] = 1;
    initialWeightText.textContent = `Weight: ${weights[currentPlaylistID][selectedSong]}`;
    (_d = document.querySelector(`.weight-slider-x-button`)) == null ? void 0 : _d.addEventListener(`click`, function() {
      var _a2;
      (_a2 = document.querySelector(`.weight-slider-popup`)) == null ? void 0 : _a2.remove();
    });
    let slider = document.querySelector(`.weight-slider`);
    slider == null ? void 0 : slider.setAttribute("min", settings.getFieldValue("min-weight"));
    slider == null ? void 0 : slider.setAttribute("max", settings.getFieldValue("max-weight"));
    slider == null ? void 0 : slider.setAttribute("value", weights[currentPlaylistID][selectedSong].toString());
    (_e = document.querySelector(`.weight-slider`)) == null ? void 0 : _e.addEventListener(`input`, function(e2) {
      var _a2;
      let weightText = document.querySelector(`.weight-text`);
      if (!weightText)
        return;
      let weight = e2.target.value;
      weightText.textContent = `Weight: ${weight}`;
      (_a2 = document.getElementById(`${selectedSong}`)) == null ? void 0 : _a2.setAttribute("value", weight);
      weights[currentPlaylistID][selectedSong] = weight;
      Spicetify.LocalStorage.set("weights", JSON.stringify(weights));
    });
  }
  function setSelectedSong(uri) {
    return (e) => {
      selectedSong = uri;
      console.log(`current song is now ${uri}`);
    };
  }
  async function addWeightSliders(playlistContents) {
    var _a, _b, _c, _d;
    if (!weightedness[currentPlaylistID])
      return;
    let sortingOrderTextContent = (_b = (_a = document.querySelector(".w6j_vX6SF5IxSXrrkYw5")) == null ? void 0 : _a.firstChild) == null ? void 0 : _b.textContent;
    if (sortingOrderTextContent != "Custom order") {
      return;
    }
    let playlistRows = playlistContents == null ? void 0 : playlistContents.childNodes[1].childNodes;
    for (let i = 0; i < playlistRows.length; i++) {
      let count = (_c = playlistRows[i].firstChild) == null ? void 0 : _c.childNodes[1].childNodes.length;
      if (count == void 0)
        continue;
      if (count >= 3)
        continue;
      let songIndex = playlistRows[i].getAttribute(`aria-rowindex`) - 2;
      if (!selectedPlaylistContents[songIndex]) {
        console.log(`can't find song at index ${songIndex}`);
      }
      let uri = selectedPlaylistContents[songIndex].link.split(":")[2];
      let weightButton = htmlToElement(weightButtonTemplateString + `id="${uri}">`);
      weightButton.addEventListener("click", setSelectedSong(uri));
      weightButton.addEventListener("click", openWeightSliderPopup);
      (_d = playlistRows[i].firstChild) == null ? void 0 : _d.childNodes[1].appendChild(weightButton);
      let button = document.getElementById(`${uri}`);
      if (button)
        button.setAttribute("value", `${weights[currentPlaylistID][uri]}`);
    }
  }
  async function removeWeightSliders() {
    document.querySelectorAll(`.weight-slider-access-button`).forEach((item) => {
      item.remove();
    });
  }
  async function listenThenAddWeightSliders() {
    var _a;
    await new Promise((r) => setTimeout(r, 1e3));
    currentPlaylistID = getCurrentPlaylistID();
    let uri = Spicetify.URI.fromString(`spotify:playlist:${currentPlaylistID}`);
    const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri.toString()}/rows`, {
      policy: { link: true }
    });
    selectedPlaylistContents = res.rows;
    const playlistContents = (_a = document.querySelector("." + playlistContentClassName)) == null ? void 0 : _a.querySelector("." + playlistContentClassNameDeeper);
    if (!playlistContents)
      return;
    let playlistRowsParent = playlistContents == null ? void 0 : playlistContents.childNodes[1];
    while (!playlistRowsParent) {
      playlistRowsParent = playlistContents == null ? void 0 : playlistContents.childNodes[1];
      await new Promise((r) => setTimeout(r, 100));
    }
    addWeightSliders(playlistContents);
    const observer = new MutationObserver(function appchange() {
      getCurrentPlaylistID();
      addWeightSliders(playlistContents);
    });
    observer.observe(playlistRowsParent, { childList: true, subtree: true });
  }
  function listenThenApply(pathname) {
    const observer = new MutationObserver(function appchange() {
      const bar = document.querySelector(".main-actionBar-ActionBarRow");
      if (bar && pathname.includes("playlist")) {
        getCurrentPlaylistID();
        initializeWeightsForPlaylist(currentPlaylistID);
        addWeightedSwitch();
        listenThenAddWeightSliders();
        observer.disconnect();
      } else {
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }
  function pickNextSong(playlist) {
    let playlistWeights = weights[playlist];
    let weightSum = 0;
    Object.entries(playlistWeights).forEach(([key, value]) => {
      weightSum += Number(value);
    });
    let roll = Math.random() * weightSum;
    let songResult;
    Object.entries(playlistWeights).forEach(([key, value]) => {
      roll -= Number(value);
      if (roll <= 0) {
        songResult = key;
        roll = 1e9;
        return;
      }
    });
    return songResult;
  }
  function rollAndAdd(playlistURI) {
    let nextSong = pickNextSong(playlistURI);
    console.log(`Next song is : ${nextSong}`);
    let uris = [`spotify:track:${nextSong}`];
    setTimeout(() => {
      Spicetify.Player.origin._queue.addToQueue(uris.map((track) => {
        return { uri: track };
      }));
    }, 100);
    lastAdded = uris[0];
  }
  async function removeFromQueue(index) {
    let nextTrack = Spicetify.Platform.PlayerAPI._queue._state.nextTracks[index];
    let uid = nextTrack.contextTrack.uid;
    let uri = nextTrack.contextTrack.uri;
    let nextTrackObj = { uid, uri };
    let nextTrackArr = [];
    nextTrackArr[0] = nextTrackObj;
    console.log(nextTrackArr);
    await new Promise((p) => {
      setTimeout(() => {
        Spicetify.Player.origin._queue.removeFromQueue(nextTrackArr);
      }, 300);
    });
  }
  async function onSongChange() {
    await new Promise((r) => setTimeout(r, 250));
    let context = Spicetify.Platform.PlayerAPI._state.context.uri;
    let playlistURI = context.split(":")[2];
    let provider = Spicetify.Platform.PlayerAPI._queue._state.nextTracks[0].provider;
    let nextProvider = Spicetify.Platform.PlayerAPI._queue._state.nextTracks[1].provider;
    let farProvider = Spicetify.Platform.PlayerAPI._queue._state.nextTracks[2].provider;
    let nextTrackID = Spicetify.Platform.PlayerAPI._queue._state.nextTracks[0].contextTrack.uri;
    if (playlistURI != lastPlaylist) {
      lastPlaylist = playlistURI;
      if (farProvider == "queue") {
        return;
      }
      removeFromQueue(0);
    }
    if (nextProvider == "queue") {
      console.log("Next is from queue - Not interfering with the queue.");
      return;
    }
    if (provider == "queue" && nextTrackID != lastAdded) {
      console.log("Not interfering with the queue.");
      return;
    }
    if (context.includes("playlist")) {
      if (lastPlaylist != playlistURI)
        console.log("Playlist Change!");
      lastPlaylist = playlistURI;
      if (weightedness[playlistURI] === void 0 || weightedness[playlistURI] === null) {
        console.log(`Playlist ${playlistURI} does not have an entry in weightedness.`);
        return;
      } else if (weightedness[playlistURI] === false) {
        console.log(`Playlist ${playlistURI} is unweighted`);
        return;
      } else
        console.log(`Playlist ${playlistURI} is weighted with weights ${weights[playlistURI]}`);
      rollAndAdd(playlistURI);
    }
  }
  function dragElement(elmnt) {
    let oldmousemove = document.onmousemove;
    let oldmouseup = document.onmouseup;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
      e = e || window.event;
      if (e.path[0].className == "weight-slider") {
        return;
      }
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
      e = e || window.event;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }
    function closeDragElement() {
      document.onmouseup = oldmouseup;
      document.onmousemove = oldmousemove;
    }
  }
  async function main() {
    settings = new SettingsSection("Song Weighting", "song-weights");
    settings.addInput("min-weight", "Minimum Song Weight", "0.25");
    settings.addInput("max-weight", "Maximum Song Weight", "10");
    settings.pushSettings();
    let storedWeightedness = Spicetify.LocalStorage.get("weightedness");
    if (!storedWeightedness)
      Spicetify.LocalStorage.set("weightedness", JSON.stringify({}));
    else
      weightedness = JSON.parse(storedWeightedness);
    let storedWeights = Spicetify.LocalStorage.get("weights");
    if (!storedWeights) {
      storedWeights = JSON.stringify({});
      Spicetify.LocalStorage.set("weights", JSON.stringify({}));
    }
    weights = JSON.parse(storedWeights);
    while (!(Spicetify == null ? void 0 : Spicetify.showNotification)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    listenThenApply(Spicetify.Platform.History.location.pathname);
    Spicetify.Platform.History.listen(({ pathname }) => {
      listenThenApply(pathname);
    });
    Spicetify.Player.addEventListener("songchange", onSongChange);
  }
  var app_default = main;

  // node_modules/spicetify-creator/dist/temp/index.jsx
  (async () => {
    await app_default();
  })();
})();

(async () => {
    if (!document.getElementById(`weightedDplaylists`)) {
      var el = document.createElement('style');
      el.id = `weightedDplaylists`;
      el.textContent = (String.raw`
  /* C:/Users/Matt/AppData/Local/Temp/tmp-32404-nvXNf8Ew26ii/1814c03d6390/settings.module.css */
.settings-module__settingsContainer___e9wxn_weightedDplaylists {
  display: contents;
}
.settings-module__heading___AnER-_weightedDplaylists {
  grid-column: 1/-1;
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: #fff;
  margin-top: 24px;
}
.settings-module__description___dP4fR_weightedDplaylists {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.settings-module__inputWrapper___LgOrw_weightedDplaylists {
  display: flex;
  justify-self: end;
}

      `).trim();
      document.head.appendChild(el);
    }
  })()