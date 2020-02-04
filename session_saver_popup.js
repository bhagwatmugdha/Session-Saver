document.getElementById("save_session").onclick = function () {
    var session_name = document.getElementById("session_name").value;

    if (session_name) {
        // Fetch all tabs in the current window
        chrome.tabs.query({ currentWindow: true }, function (tabs) {
            
            chrome.storage.sync.get('session_names', function(result){
                if(result.session_names){
                    session_names = result.session_names;
                    session_names[session_name] = tabs;
                    chrome.storage.sync.set({session_names})
                }
                else {
                    var session_names = {}
                    session_names[session_name] = tabs;
                    chrome.storage.sync.set({session_names})
                }
            })

        })

        chrome.storage.sync.get('session_tabs', function (result) {
            if (result.session_tabs) {
                var tab_names = result.session_tabs;
            }
            else {
                var tab_names = []
            }
            tab_names.push(session_name);
            chrome.storage.sync.set({ session_tabs: tab_names })
        })
    }
    else {
        alert("Please give the session an apprpriate name to save!");
    }
}

window.onload = function load_sessions() {
    chrome.storage.sync.get(null, function callback(items) { console.log(items) });
    
    chrome.storage.sync.get('session_tabs', function (result) {
        if (result.session_tabs) {
            var tab_names = result.session_tabs;
            for (tab in tab_names) {
                // Add saved session as a button to restore
                var saved_sessions = document.getElementById("saved_sessions");
                
                var newButton = document.createElement("button");
                
                //Assign different attributes to the element. 
                newButton.type = "button";
                newButton.className = "btn btn-primary";
                newButton.style = "margin: 4px; width: 100%";
                newButton.innerHTML = tab_names[tab];
                
                // Funtion on click to open the session
                newButton.onclick = function () {
                    var session_name = this.innerHTML;
                    
                    chrome.storage.sync.get('session_names', function (result) {
                        // alert("clicked", Object.keys(result))

                        var session_tabs = result.session_names[session_name];
                        // alert(session_tabs[session_name])
                        
                        for (tab in session_tabs) {
                            // alert(session_tabs[tab].url)
                            chrome.tabs.create({ url: session_tabs[tab].url }, function () {
                            })
                        }
                    })
                };

                //Append the element in page
                saved_sessions.appendChild(newButton);
            }
        }
    })
}   