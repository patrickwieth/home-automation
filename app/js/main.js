(function () {
    var name = "none";
    var newName = "none";

    var LOCAL_STORAGE_DECISION_FN = 'decisionFn';

    window.name = name;
    window.newName = newName;

    /*
    enableEditor();

    function enableEditor() {
        var editor = ace.edit("editor");
        //editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");

        editor.getSession().on('change', function(e) {
            setLocalStorageItem(LOCAL_STORAGE_DECISION_FN, editor.getValue());
            setDecisionFunction(editor.getValue());
        });

        var decisionFn = getLocalStorageItem(LOCAL_STORAGE_DECISION_FN);

        if(decisionFn) {
            editor.setValue(decisionFn);
        }
    }
    */


    function setName(string) {

        newName = string.value;
        /*socket.send({
         type: "setParameters",
         huntRate: name
         });*/
    }

    function trigger(obj) {
        console.log(obj);
        socket.send(obj);
    }

    function switchOn(obj) {
        console.log(obj);
        socket.send(obj);
    }

    function switchOff(id) {
        console.log(id);

        if (d3.select("#startBtn").html() == "Start") {
            d3.select("#startBtn").html("Pause");            
        }
        else {
            d3.select("#startBtn").html("Start");
        }

        socket.send(id);
    }

    window.trigger = trigger;
    window.switchOn = switchOn;
    window.switchOff = switchOff;

    var socket = io.connect();
    window.socket = socket;

    // get registered
    var myKey;
    socket.on('message', function (event) {
        if (typeof event === 'object') {
            if (typeof event.key === 'string') {
                myKey = event.key;
                window.myKey = myKey;
                console.log(myKey);
            }
        }
    });

    // humidity update
    socket.on('humidity', function (humidity) {
        console.log(humidity);
        
        window.tick(humidity/10);
    });

    function getLocalStorageItem(name) {
        var item = window.localStorage.getItem(name);;
        try {
            item = JSON.parse(item);
        } catch(e) {}
        return item;
    }

    function setLocalStorageItem(name, value) {
        window.localStorage.setItem(name, typeof value === 'object' ? JSON.stringify(value) : value );
    }
})();