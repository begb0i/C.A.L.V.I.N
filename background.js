console.log('[C.A.L.V.I.N - BACKGROUND]');
const DEFAULT_SETTINGS = {
    'timecodes': [0], 
    'phrases': ['Nothing yet'], 
    'temporary': '', 
    'temporaryLink': '', 
    'site': 'a'
}
var subtitleLink = '',
    [timecode, phrase] = [[], []];

chrome.runtime.onInstalled.addListener(() => { chrome.storage.local.set({ key: DEFAULT_SETTINGS }); });

chrome.webNavigation.onBeforeNavigate.addListener(function () {

    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            if (details.url.toString().includes('https://www.youtube.com/api/timedtext')) {

                if (subtitleLink.toString() === details.url.toString()) { return; }
                subtitleLink = details.url.toString();
    
                requestJSON(subtitleLink);
            }
        }, { urls: ["<all_urls>"] }, ['requestBody'])
});


const requestJSON = async (jsonUrl) => {
    const response = await fetch(jsonUrl),
        json = await response.text(),
        jsonEvent = JSON.parse(json).events;

    start = performance.now();
   
    for (_ in jsonEvent) { loopThrough(jsonEvent[_]) }
    end = performance.now();

    chrome.storage.local.get(['key'], (result) => {
     
        chrome.storage.local.set({ key: { 'timecodes': timecode, 'phrases': phrase, "site": result.key.site } }, () => {
            [timecode, phrase] = [[], []]; 
        });
    });

    console.log('[PERFORMANCE TIME] is ' + Math.ceil((end - start) / 1000) + ' sec');

}


function loopThrough(obj) {
    let sentence = '';
    for (i in obj) {
        if (Object.keys(obj[i]).length > 0 && typeof obj[i] !== 'string') {
            if (i === 'segs' && Object.keys(obj[i]).length > 0) {
                if (Object.keys(obj[i]).length === 1) {
                    if (obj[i][0].utf8 === '\n') { return; }
                    phrase.push(obj[i][0].utf8.replaceAll('\n', ' '));
                    timecode.push(obj.tStartMs);
                } else {
                    for (let l = 0; l < Object.keys(obj[i]).length; l++) { sentence += obj[i][l].utf8 }
                    phrase.push(sentence.replaceAll('\n', ' '));
                    timecode.push(obj.tStartMs);
                }
            }
        }
    }
}


chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    id: 'C.A.L.V.I.N_ID',
    title: "Reset to default",
    contexts: ["action"]
});
chrome.contextMenus.onClicked.addListener((info) => {
    const { menuItemId } = info
    if (menuItemId === 'C.A.L.V.I.N_ID') {
        chrome.storage.local.set({ key: DEFAULT_SETTINGS })
    }
});