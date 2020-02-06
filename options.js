document.getElementById("delete_all_sessions").onclick = function () {
    chrome.storage.local.clear(function (result) {
    })
    window.location.reload();
}

window.onload = function load_table() {
    var tab_table_div = document.getElementById("tab_table");

    chrome.storage.local.get('session_tabs', function (result) {
        if (result.session_tabs) {

            chrome.storage.local.get('session_names', function (session_name_result) {
                var tab_names = result.session_tabs;

                for (tab in tab_names) {
                    var session_name = tab_names[tab];

                    var session_tabs = session_name_result.session_names[session_name];

                    // Div to wrap around session title and delete button
                    var wrap_div = document.createElement("div");

                    //  Create a h3 for the session name
                    var session_name_title = document.createElement("h3");
                    session_name_title.style = "margin: 10px; display: inline-block;";
                    session_name_title.innerHTML = session_name;

                    //  Create a button to delete the session
                    var deleteButton = document.createElement("button");
                    deleteButton.className = "btn btn-danger";
                    deleteButton.style = "margin: 4px; float:right";
                    deleteButton.innerHTML = "Delete " + session_name;
                    deleteButton.type = "submit"

                    // Funtion on click to delete the session
                    deleteButton.onclick = function () {
                        var session_name = this.innerHTML.split("Delete ")[1];

                        chrome.storage.local.get('session_tabs', function (result) {
                            var tab_names = result.session_tabs;
                            tab_names.splice(tab_names.indexOf(session_name), 1);    chrome.storage.local.set({session_tabs: tab_names});
                        })

                        chrome.storage.local.get('session_names', function (result) {
                            var session_names = result.session_names;
                            delete session_names[session_name];
                            chrome.storage.local.set({session_names});
                        })
                        window.location.reload();
                    };

                    wrap_div.appendChild(session_name_title);
                    wrap_div.appendChild(deleteButton);

                    //  Create a table
                    var table = document.createElement("table");
                    table.className = "table table-bordered table-striped";
                    table.style = "padding: 10px;"

                    for (tab in session_tabs) {
                        var tr = document.createElement('tr');
                        tr.style = "padding: 10px;";

                        var td = document.createElement('td');
                        td.style = "padding: 10px";
                        td.innerHTML = '<a href=' + session_tabs[tab].url + '>' + session_tabs[tab].title + '</a>';

                        tr.appendChild(td);
                        table.appendChild(tr);
                    }

                    tab_table_div.appendChild(wrap_div);
                    tab_table_div.appendChild(table);
                }
            })
        }
    })

}