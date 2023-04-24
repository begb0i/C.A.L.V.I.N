console.log('[C.A.L.V.I.N - POPUP]');
var textStore = '',
    reserve = '',
    timeout = null,
    startSummary = document.querySelector('#summaryButton'),
    updateInfo = document.querySelector('#refreshButton'),
    extensionIcon = document.querySelector('#extensionIcon'),
    automateContent = document.querySelector('#automateButton'),
    loadFull = document.querySelector('#loadFullButton'),
    intervalSplit = document.querySelector('#intervalInput'),
    intervalStats = document.querySelector('#delayLabel'),
    temporaryLink = document.querySelector('#temporaryLinkLabel'),
    subtitleLink = document.querySelector('#transcriptText'),
    formattedText = document.querySelector('#formattedText');

loadInfo();
function loadInfo(limited = true) {
    isLoading(true); 

    chrome.storage.local.get(['key'], (result) => {
        if (result.key.temporaryLink) {
            temporaryLink.innerText = result.key.temporaryLink;
            temporaryLink.href = result.key.temporaryLink;
        } else { temporaryLink.innerText = 'Click the left column to copy subtitles or Click the right column to copy the summarized text'; }

        document.querySelectorAll('input[value="' + result.key.site + '"]')[0].checked = true;
        subtitleLink.innerHTML = "";
        reserve = result.key;

        textLength = (limited) ? 50 : result.key.timecodes.length;
        for (var i = 0; i < textLength; i++) {
            if (!result.key.phrases[i]) { break; }
            subtitleLink.innerHTML += msToTime(result.key.timecodes[i]) + ' ' + result.key.phrases[i] + '<br/>';
        }
        applyFilter(); 
        isLoading(false); 
    });
}
function isLoading(l) {
    if (l === true) {
        loadFull.style.color = 'rgb(255 255 255)';
        startSummary.style.backgroundColor = 'white';
        updateInfo.style.backgroundColor = 'white';
    } else {
        loadFull.style.color = '#ffffff70';
        startSummary.style.backgroundColor = '';
        updateInfo.style.backgroundColor = '';
    }

}

intervalSplit.addEventListener('keyup', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        applyFilter();
    }, 500);
});

intervalSplit.addEventListener("change", function () { applyFilter(); }, false);

subtitleLink.onclick = () => { copyToClipboard(subtitleLink.innerText) };
updateInfo.onclick = () => { loadInfo(false); }
loadFull.onclick = () => { loadInfo(false); }
formattedText.onclick = () => { copyToClipboard(textStore) };
extensionIcon.onclick = () => { chrome.tabs.create({ url: 'https://www.youtube.com/@C.A.L.V.I.N_PH/featured', active: true }); };
startSummary.onclick = () => {

}
automateContent.onclick = () => {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { target: 'content', action: "refreshTab" });
    });
    reserve.temporaryLink = "Refersh the page if get content button didn't fuctioned as intended"; 
    chrome.storage.local.set({ key: reserve });
    window.close()
};

function applyFilter() {
    const intervalSec = (intervalSplit.value) ? intervalSplit.value * 1000 : 4000;
    let count = 0;

    textStore = JSON.parse(JSON.stringify(reserve.phrases));
    for (i in reserve.timecodes) {
        
        if (i > 0 && reserve.timecodes[i] - reserve.timecodes[i - 1] > intervalSec) {
            count += 1;
            textStore[i - 1] = textStore[i - 1] + '\n';
        }
    }
   
    textStore = textStore.join(' ').replace('\n', '').replaceAll('\n ', '\n');
    formattedText.innerText = textStore
    document.querySelector('#wordCount').innerText = textStore.trim().split(/\s+/).length + ' Words counted';
}
function copyToClipboard(text) {
    let copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}
function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds 
}


for (const radioButton of document.querySelectorAll('input[name="summarizer"]')) {
    radioButton.addEventListener('change', function (e) {
        if (this.checked) {
            reserve.site = this.value
            chrome.storage.local.set({ key: reserve });
        }
    });
}
