User Agent Spoofer (Chrome Extension)

A simple Chrome extension to conditionally spoof the user agent based upon domain / URL of the page visited

**Note:** It is recommend to use a 'full featured' user agent (IE, Firefox etc) for the user agent as any pages that 'browser sniff' for features may cease to function as an unknown user agent is detected.

## Install

To install on Chrome, simply add the directory containing all the files to Chrome as an unpacked extension via the 'Extensions' setting page.

**Note:** You will need to enable 'Developer' mode and put up with the annoying prompt every initial Chrome load if you are using the release channel of Chrome!

## Basic Usage

Click the 'Spoof User Agent' icon on the Chrome toolbar to launch the form. Simply enter in a domain name **without protocol** into the 'Domain Name' area (e.g. eminentspoon.com) followed by the user agent you wish to mimic for all requests matching the domain into the 'Associated User Agent' box. Clicking 'Insert Row' will activate the spoofing and will show the rule in the table at the top of the form. You can easily remove added entries by clicking 'Remove Row', this will remove the spoofing immediately. If the user agent spoofing is active for a current page, the extension icon will be green, otherwise it will be red.

**Note:** You are able to have different user agents for different paths on the same domain if they are entered into the 'Domain Name' box (e.g. eminentspoon.com/different/useragent).

## Structure

The extension is split into two halves, the extension 'form' for adding / removing domains from user agent spoofing and the background script that runs on page load. The event listener that amends the user agent is bound so that it will only run on pages that match domains that are entered, this should mean that it is as efficient as possible.

## Motivation

In my work environment, certain intranet / internal web applications only allowed Internet Explorer traffic, redirecting all other traffic to an error page. This got old super fast so I made this to get around it! The sites now think that the chrome traffic is coming from IE 11 rather than Chrome.

##License

Chrome User Agent Spoofer is licensed under [The MIT License (MIT)](LICENSE).