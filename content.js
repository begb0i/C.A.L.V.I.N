console.log('[YS - CONTENT]');
var reserve, sites = {
    "a": "https://app.summari.com/demo",
};
chrome.storage.local.get(['key'], (result) => {
    reserve = result.key;
    
    if (document.location.href === 'https://uau.li/') {
        
        document.querySelector('#data').innerHTML = result.key.temporary;
        document.querySelector('#data').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('#').click();
        setTimeout(() => {
            reserve.temporaryLink = "https://" + document.querySelector('#result').innerText;
            chrome.storage.local.set({ key: reserve });
        }, 1000);
    }
    
    else if (document.location.href === 'https://app.summari.com/demo') {
        window.localStorage.clear(); 

        if (!document.querySelector('#link')) { window.location.reload(); }

        document.querySelector('#link').value = result.key.temporaryLink
        document.querySelector('#link').dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => { document.querySelector('button').click(); }, 2000);
    }
  
    
    if (reserve.temporaryLink === "!") {
        setTimeout(() => { document.querySelector(".ytp-subtitles-button").click(); }, 2000);
    }

});


chrome.runtime.onMessage.addListener((request) => {
    if (request.target === "content" && request.action === 'refreshTab') {
        document.location.reload();
    }

});