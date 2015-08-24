var domainAgent;

chrome.storage.local.get('agents', function(value){
	var urlFilter = new Array(), i,x,l,p,extraInfoSpec= ["requestHeaders", "blocking"];
	domainAgent = value.agents;
	for(i = 0; i < value.agents.length; i++){
		urlFilter.push(value.agents[i].domain);
	}

	chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
		var headers = details.requestHeaders, blockingResponse = {};
		if(domainAgent !== undefined){
			for(p=0; p < domainAgent.length; p++){
				if(patternToRegExp(domainAgent[p].domain).test(details.url)){
					console.log("url matched with " + domainAgent[p].domain);
					for(x = 0, l = headers.length; x < l; ++x){
						if(headers[x].name === "User-Agent"){
							headers[x].value = domainAgent[p].agent;
							break;
						}
					}
				}
			}
		}
		blockingResponse.requestHeaders = headers;
		return blockingResponse;

	}, { urls : urlFilter }, extraInfoSpec);
});

function patternToRegExp(pattern){
	if(pattern == "<all_urls>") return /^(?:http|https|file|ftp):\/\/.*/;

  var split = /^(\*|http|https|file|ftp):\/\/(.*)$/.exec(pattern);
  if(!split) throw Error("Invalid schema in " + pattern);
  var schema = split[1];
  var fullpath = split[2];

  var split = /^([^\/]*)\/(.*)$/.exec(fullpath);
  if(!split) throw Error("No path specified in " + pattern);
  var host = split[1];
  var path = split[2];

  // File
  if(schema == "file" && host != "")
    throw Error("Non-empty host for file schema in " + pattern);

  if(schema != "file" && host == "")
    throw Error("No host specified in " + pattern);

  if(!(/^(\*|\*\.[^*]+|[^*]*)$/.exec(host)))
    throw Error("Illegal wildcard in host in " + pattern);

  var reString = "^";
  reString += (schema == "*") ? "https*" : schema;
  reString += ":\\/\\/";
  // Not overly concerned with intricacies
  //   of domain name restrictions and IDN
  //   as we're not testing domain validity
  reString += host.replace(/\*\.?/, "[^\\/]*");
  reString += "\\/";
  reString += path.replace("*", ".*");
  reString += "$";

  return RegExp(reString);
}
