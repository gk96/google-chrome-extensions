function save_options(val) {
        
        chrome.storage.sync.set({
            "option": val,
          }, function() {
            // Update status to let user know options were saved.
            console.log("option saved!!");
          });
  }
  function save_speeds(val) {
        
    chrome.storage.sync.set({
        "speed": val,
      }, function() {
        // Update status to let user know options were saved.
        console.log("option saved!!");
      });
}
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    
    chrome.storage.sync.get("option", function (obj) {      
      document.getElementsByName('choice').forEach(e => {
            
            if (e.value == obj.option)  
                e.checked = true;
      });
    });
    chrome.storage.sync.get("speed", function (obj) {      
        document.getElementsByName('speedChoice').forEach(e => {
              
              if (e.value == obj.speed)  
                  e.checked = true;
        });
      });
  }

document.addEventListener('DOMContentLoaded', function(){
    restore_options();
    document.getElementsByName('choice').forEach(choice => {
        choice.addEventListener('change',function(){
            if (choice.value == "0")
            {
                chrome.browserAction.setPopup({
                    popup: ''
                });
            }
            else
            {
                chrome.browserAction.setPopup({
                    popup: 'main.html'
                });
            }
            save_options(choice.value)
            });
    });
    document.getElementsByName('speedChoice').forEach(choice => {
        choice.addEventListener('change',function(){
            save_speeds(choice.value);
            });
    });
});

