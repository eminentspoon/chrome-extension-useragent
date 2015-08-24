function saveChanges(){
	chrome.storage.local.get("agents", function(values){
		var domainTextBox = document.getElementById("domain");
		var agentTextBox = document.getElementById("userAgent");
		var result = values.agents;
		if(result === undefined){
			result = new Array();
		}else{
			if(!valueExists(domainTextBox.value, result)){
				result.push({"domain": domainTextBox.value, "agent" : agentTextBox.value});
			}
		}
		chrome.storage.local.set({"agents" : result}, function(){
			bindValues();
		});
	});
}


function valueExists(domain, array){
	for(i=0;i<array.length;++i){
		if(array[i].domain.toUpperCase() === domain.toUpperCase()){
			return true;
			break;
		}
	}
	return false;
}

function removeValueFromArray(domain, array){
	var valToSplice;
	for(i=0;i<array.length;++i){
		if(array[i].domain.toUpperCase() === domain.toUpperCase()){
			valToSplice = i;
		}
	}

	if(valToSplice !== undefined){
		array.splice(valToSplice, 1);
	}

	return array;
}

function bindValues(){
	chrome.storage.local.get("agents", function(values){
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
		var existingValues = values.agents;

		existingValues.sort(function(a,b){
			var domA=a.domain.toLowerCase(), domB=b.domain.toLowerCase();
			if(domA<domB){
				return 1;
			}
			if(domA>domB){
				return -1;
			}
			return 0;
		});

		if(existingValues.length === 0){
			var noEntryRow = table.insertRow(1);
			var spanCell = noEntryRow.insertCell(0);
			spanCell.colSpan = 3;
			spanCell.innerHTML = "No Results Found";
			spanCell.classList.add("centreCell");
		}

		for(i=0;i<existingValues.length;++i){
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
	});
}

function removeValue(object){
	var domainValue = object.currentTarget.parentElement.parentElement.children[0].innerText;
	chrome.storage.local.get("agents", function(values){
		var array = values.agents;
		array = removeValueFromArray(domainValue, array);

		chrome.storage.local.set({"agents": array}, function(){
			bindValues();
		});
	});
}

function init(){
	bindValues();

	var save = document.getElementById("savebtn");
	save.addEventListener('click', function(){
		saveChanges();
	});
}

document.addEventListener('DOMContentLoaded', init);
