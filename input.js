/*global chrome*/
var ieDefaultUserAgentString = "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";
var firefoxDefaultUserAgentString = "Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0";
var domainTextBox, agentTextBox, result, infoPopup, transparencyLayer, noErrors, i;

function isFormValid(){
	noErrors = true;

	if(domainTextBox.value.length <= 0){
		alert("Please ensure that the domain name is populated");
		noErrors = false;
	}

	if(agentTextBox.value.length <= 0){
		alert("Please ensure that the agent name is populated");
		noErrors = false;
	}

	return noErrors;
}

function clearForm(){
	domainTextBox.value = "";
	agentTextBox.value = "";
}

function saveChanges() {
	if (isFormValid()) {
		chrome.storage.local.get("agents", function (values) {
			result = values.agents;
			if (result === undefined) {
				result = new Array();
			} else {
				if (valueExists(domainTextBox.value, result)) {
					alert("You cannot have duplicate domain values");
					return;
				}
			}
			result.push({ "domain": domainTextBox.value, "agent": agentTextBox.value });
			chrome.storage.local.set({ "agents": result }, function () {
				bindGrid();
				clearForm();
			});
		});

		chrome.webRequest.handlerBehaviorChanged();
	}
}

function valueExists(domain, array) {
	for (i = 0; i < array.length; ++i) {
		if (array[i].domain.toUpperCase() === domain.toUpperCase()) {
			return true;
		}
	}
	return false;
}

function removeValueFromArray(domain, array) {
	var valToSplice;
	for (i = 0; i < array.length; ++i) {
		if (array[i].domain.toUpperCase() === domain.toUpperCase()) {
			valToSplice = i;
		}
	}

	if (valToSplice !== undefined) {
		array.splice(valToSplice, 1);
	}

	return array;
}

function bindGrid() {
	chrome.storage.local.get("agents", function (values) {
		var table = document.getElementById("currentOptions");
		table.innerHTML = "";
		var headerRow = table.insertRow(0);
		headerRow.classList.add("header");
		var domainHeader = headerRow.insertCell(0);
		var agentHeader = headerRow.insertCell(1);
		var actionHeader = headerRow.insertCell(2);
		domainHeader.innerHTML = "Domain";
		agentHeader.innerHTML = "Agent";
		actionHeader.innerHTML = "Actions";

		if (values.agents !== undefined && values.agents.length > 0) {
			var existingValues = values.agents;

			existingValues.sort(function (a, b) {
				var domA = a.domain.toLowerCase(), domB = b.domain.toLowerCase();
				if (domA < domB) {
					return 1;
				}
				if (domA > domB) {
					return -1;
				}
				return 0;
			});

			for (i = 0; i < existingValues.length; ++i) {
				var row = table.insertRow(1);
				var cell = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				cell.innerHTML = existingValues[i].domain;
				cell2.innerHTML = existingValues[i].agent;
				var delButton = document.createElement("input");
				delButton.type = "submit";
				delButton.value = "Remove Row";
				delButton.addEventListener('click', removeValue);
				cell3.appendChild(delButton);
			}
		}
		else {
			var noEntryRow = table.insertRow(1);
			var spanCell = noEntryRow.insertCell(0);
			spanCell.colSpan = 3;
			spanCell.innerHTML = "No Results Found";
			spanCell.classList.add("centreCell");
		}
	});
}

function removeValue(object) {
	var domainValue = object.currentTarget.parentElement.parentElement.children[0].innerText;
	chrome.storage.local.get("agents", function (values) {
		var array = values.agents;
		array = removeValueFromArray(domainValue, array);

		chrome.storage.local.set({ "agents": array }, function () {
			bindGrid();
		});
	});
}

function init() {
	bindGrid();
	bindListeners();

	domainTextBox = document.getElementById("domainText");
	agentTextBox = document.getElementById("userAgentText");
	transparencyLayer = document.getElementById("transLayer");
	infoPopup = document.getElementById("infopopup");
}

function bindListeners() {
	document.getElementById("formSubmit").addEventListener('click', function () {
		saveChanges();
	});
	document.getElementById("setIEUserAgent").addEventListener("click", function () {
		setUserAgentValue(ieDefaultUserAgentString);
	});
	document.getElementById("setFirefoxUserAgent").addEventListener("click", function () {
		setUserAgentValue(firefoxDefaultUserAgentString);
	});
	document.getElementById("selectCurrentDomain").addEventListener("click", setCurrentDomain);
	document.getElementById("closePop").addEventListener("click", function(){showPopUp(false);});

	var infopops = document.getElementsByClassName("infopop");

	for (i = 0; i < infopops.length; i++) {
		infopops[i].addEventListener("click", popupClickHander);
	}
}

function popupClickHander(){
document.getElementById("infopopHeader").innerHTML = this.getAttribute("data-infopoptitle");
			document.getElementById("infopopText").innerHTML = this.getAttribute("data-infopoptext");
			showPopUp(true);
}

function showPopUp(show){
	transparencyLayer.className = show ? "show" : "";
	infoPopup.className = show ? "show" : "";
}

function setCurrentDomain(){
	chrome.tabs.getSelected(null, function(tab) {
		var currentUrl = tab.url;
		var tempHref = document.createElement("a");
		tempHref.href = currentUrl;

		domainTextBox.value = tempHref.hostname;
	});
}

function setUserAgentValue(userAgentString) {
	agentTextBox.value = userAgentString;
}

document.addEventListener('DOMContentLoaded', init);