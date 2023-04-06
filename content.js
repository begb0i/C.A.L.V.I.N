console.log('[C.A.L.V.I.N - CONTENT]');
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
            document.location.href = sites[reserve.site];
        }, 1000);
    }
    else if (document.location.href === 'https://app.summari.com/demo') {
        window.localStorage.clear(); 

        if (!document.querySelector('#link')) { window.location.reload(); }

        document.querySelector('#link').value = result.key.temporaryLink
        document.querySelector('#link').dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => { document.querySelector('button').click(); }, 2000);
    }

});
chrome.runtime.onMessage.addListener((request) => {
    if (request.target === "get content" && request.action === 'refreshTab') {
        document.location.reload();
    }

});