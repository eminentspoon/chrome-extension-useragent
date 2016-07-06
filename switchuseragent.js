/*global chrome*/
var domainAgent, listenerFunction, headers, p, x, i, extraInfoSpec, blockingResponse, buildUrlFilter, tabAssociation, agentOnIcon, agentOffIcon, currentTabCheckFunction, lastFiredTab;
agentOnIcon = "images/agenton_38.png";
agentOffIcon = "images/agentoff_38.png";

currentTabCheckFunction = function(tab){
	if(tab.id == lastFiredTab){
		chrome.browserAction.setIcon({
			path: agentOnIcon
		});
	}
};

listenerFunction = function (details) {
    headers = details.requestHeaders;
    blockingResponse = {};
    tabAssociation[details.tabId] = false;
    if (domainAgent !== undefined) {
        for (p = 0; p < domainAgent.length; p++) {
            if (details.url.indexOf(domainAgent[p].domain) > -1) {
                for (x = 0; x < headers.length; ++x) {
                    if (headers[x].name === "User-Agent") {
						lastFiredTab = details.tabId;
                        tabAssociation[details.tabId] = true;
                        headers[x].value = domainAgent[p].agent;
                        break;
                    }
                }
            }
        }
    }
    chrome.tabs.getSelected(null, currentTabCheckFunction);
    blockingResponse.requestHeaders = headers;
    return blockingResponse;
};

tabAssociation = new Array();

extraInfoSpec = ["requestHeaders", "blocking"];

chrome.storage.local.get("agents", function (value) {
    domainAgent = value.agents;
    replaceAndBindHeaderListener();
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "local") {
        domainAgent = changes.agents.newValue;
        replaceAndBindHeaderListener();
    }
});

chrome.tabs.onCreated.addListener(function (tab) {
    if (tabAssociation[String(tab.id)] === undefined) {
        tabAssociation[String(tab.id)] = false;
    }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    if (tabAssociation[activeInfo.tabId] === undefined) {
        tabAssociation[activeInfo.tabId] = false;
    }

    var pathToSet = tabAssociation[activeInfo.tabId] ? agentOnIcon : agentOffIcon;

    chrome.browserAction.setIcon({
        path: pathToSet
    });
});

function replaceAndBindHeaderListener() {
    if (chrome.webRequest.onBeforeSendHeaders.hasListener(listenerFunction)) {
        chrome.webRequest.onBeforeSendHeaders.removeListener(listenerFunction);
    }
    chrome.webRequest.onBeforeSendHeaders.addListener(listenerFunction, { urls: getUrlFilter() }, extraInfoSpec);
}

function getUrlFilter() {
    buildUrlFilter = new Array();
    for (i = 0; i < domainAgent.length; i++) {
        buildUrlFilter.push("*://*." + domainAgent[i].domain + "/*");
    }
    return buildUrlFilter;
}