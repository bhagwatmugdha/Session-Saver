document.getElementById("delete_all_sessions").onclick = function () {
    chrome.storage.sync.clear(function(result){
        
    })
}