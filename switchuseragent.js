var requestFilter = { urls: ["<all_urls>"] },
	extraInfoSpec = ["requestHeaders", "blocking"],
	handler = function(details){
		var headers = details.requestHeaders,
			blockingResponse = {};
		
		for(var i = 0, l = headers.length; i <l; ++i){
			console.log("here");
			if(headers[i].name === "User-Agent"){
				//headers[i].value = "something";
				break;
			}
		}
		
		blockingResponse.requestHeaders = headers;
		return blockingResponse;
	};

chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);
