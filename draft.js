let params = new URLSearchParams(location.search);
let id = params.get("id");
let pub = params.get("pub") == "true";
console.log(id);
let get_headers = new Headers();
get_headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');
let send_headers = new Headers();
send_headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');
send_headers.append('Content-Type', 'application/json');
let file_headers = new Headers();
file_headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');

const fieldsStatus = {
    username: false,
    pwd: false,
    text: false,
    date: false,
    favcolor: false,
    myfile: false,
    something: false,
    cars: false,
    quantity: false,
    vol: false,
};

const fieldsStatus2 = {
    vehicle1: false,
    vehicle2: false,
    vehicle3: false,
};

const fieldsStatus3 = {
    cpp: false,
    python: false,
    other: false,
};

async function onLoadPub() {
    await fetch("http://127.0.0.1:5000/publication/" + id, {headers: get_headers}).then(res => {
        let json = res.json();
        console.log(json);
        return json;
    }).then(data => {
        console.log(data);
        if (data.username) {
            document.getElementById("username").value = data.username;
        }
        if (data.pwd) {
            document.getElementById("pwd").value = data.pwd;
        }
        if (data.text) {
            document.getElementById("text").value = data.text;
        }
        if (data.cpp) {
            document.getElementById("cpp").checked = true;
        }
        if (data.python) {
            document.getElementById("python").checked = true;
        }
        if (data.other) {
            document.getElementById("other").checked = true;
        }
        if (data.vehicle1) {
            document.getElementById("vehicle1").checked = true;
        }
        if (data.vehicle2) {
            document.getElementById("vehicle2").checked = true;
        }
        if (data.vehicle3) {
            document.getElementById("vehicle3").checked = true;
        }
        if (data.date) {
            document.getElementById("date").value = data.date;
        }
        if (data.favcolor) {
            document.getElementById("favcolor").value = data.favcolor;
        }
        if (data.filename) {
            console.log("have file");
            console.log(data.filedata);
            console.log(data.filename);
            let file = new File([data.filedata], data.filename, {
                type: 'text/plain',
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            document.getElementById("myfile").files = dataTransfer.files;
        }
        if (data.something) {
            document.getElementById("something").value = data.something;
        }
        if (data.cars) {
            document.getElementById("cars").value = data.cars;
        }
        if (data.quantity) {
            document.getElementById("quantity").value = data.quantity;
        }
        if (data.vol) {
            document.getElementById("vol").value = data.vol;
        }
    });
    
    for (const [f, _] of Object.entries(fieldsStatus)) {
        document.getElementById(f).disabled = true;
    }
    for (const [f, _] of Object.entries(fieldsStatus2)) {
        document.getElementById(f).disabled = true;
    }
    for (const [f, _] of Object.entries(fieldsStatus3)) {
        document.getElementById(f).disabled = true;
    }

    document.getElementById('button2').style.display = 'none'
    document.getElementById('button3').style.display = 'none'
}

async function onLoadDraft() {
    await fetch("http://127.0.0.1:5000/draft/" + id, {headers: get_headers}).then(res => 
        res.json()
    ).then(data => {
        console.log(data);
        if (data.username) {
            document.getElementById("username").value = data.username;
        }
        if (data.pwd) {
            document.getElementById("pwd").value = data.pwd;
        }
        if (data.text) {
            document.getElementById("text").value = data.text;
        }
        if (data.cpp) {
            document.getElementById("cpp").checked = true;
        }
        if (data.python) {
            document.getElementById("python").checked = true;
        }
        if (data.other) {
            document.getElementById("other").checked = true;
        }
        if (data.vehicle1) {
            document.getElementById("vehicle1").checked = true;
        }
        if (data.vehicle2) {
            document.getElementById("vehicle2").checked = true;
        }
        if (data.vehicle3) {
            document.getElementById("vehicle3").checked = true;
        }
        if (data.date) {
            document.getElementById("date").value = data.date;
        }
        if (data.favcolor) {
            document.getElementById("favcolor").value = data.favcolor;
        }
        if (data.filename) {
            console.log("have file");
            console.log(data.filedata);
            console.log(data.filename);
            let file = new File([data.filedata], data.filename, {
                type: 'text/plain',
                // lastModified: new Date(),
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            document.getElementById("myfile").files = dataTransfer.files;
        }
        if (data.something) {
            document.getElementById("something").value = data.something;
        }
        if (data.cars) {
            document.getElementById("cars").value = data.cars;
        }
        if (data.quantity) {
            document.getElementById("quantity").value = data.quantity;
        }
        if (data.vol) {
            document.getElementById("vol").value = data.vol;
        }
        setInterval(function () {
            let modifiedFields = {};
            let file;

            for (const [f, modified] of Object.entries(fieldsStatus)) {
                if (!modified) continue;
                document.querySelector(`label[for="${f}"]`).style = "color: green;";
                fieldsStatus[f] = false;
                if (f == "myfile") {
                    file = document.getElementById(f).files[0];
                    console.log(document.getElementById(f).files[0]);
                } else {
                    modifiedFields[f] = document.getElementById(f).value;
                }
            }
            for (const [f, modified] of Object.entries(fieldsStatus2)) {
                if (!modified) continue;
                document.querySelector(`label[for="${f}"]`).style = "color: green;";
                modifiedFields[f] = "true";
                fieldsStatus2[f] = false;
            }
            for (const [f, modified] of Object.entries(fieldsStatus3)) {
                if (!modified) continue;
                modifiedFields[f] = "true";
                fieldsStatus3[f] = false;
                for (const [anotherf, _] of Object.entries(fieldsStatus3)) {
                    document.querySelector(`label[for="${anotherf}"]`).style = "color: green;";
                    if (anotherf == f) continue;
                    modifiedFields[anotherf] = "";
                }
            }
            if (Object.keys(modifiedFields).length === 0) {} else {
                console.log("have modified fields");
                console.log(JSON.stringify(modifiedFields));
                fetch("http://127.0.0.1:5000/autosave/" + id, { method: "PATCH", body: JSON.stringify(modifiedFields), headers: send_headers, files: file  });
            }
            if (file) {
                console.log("update file");
                const formData = new FormData();
                formData.append('file', file);
                fetch("http://127.0.0.1:5000/savefile/" + id, { method: "POST", body: formData, headers: file_headers, files: file });
            }
        }, 5000);
    });
    for (const [f, _] of Object.entries(fieldsStatus)) {
        document.getElementById(f).addEventListener("change", function () {
            document.querySelector(`label[for="${f}"]`).style = "color: red;";
            fieldsStatus[f] = true;
        });
    }
    for (const [f, _] of Object.entries(fieldsStatus2)) {
        document.getElementById(f).addEventListener("change", function () {
            document.querySelector(`label[for="${f}"]`).style = "color: red;";
            fieldsStatus2[f] = true;
        });
    }
    for (const [f, _] of Object.entries(fieldsStatus3)) {
        document.getElementById(f).addEventListener("change", function () {
            for (const [anotherf, _] of Object.entries(fieldsStatus3)) {
                document.querySelector(`label[for="${anotherf}"]`).style = "color: red;";
            }
            fieldsStatus3[f] = true;
        });
    }
}

window.onload = async function () {
    if (pub) {
        await onLoadPub();
    } else {
        await onLoadDraft();
    }
};

async function goBack() {
    if (pub == false) {
        let modifiedFields = {};
        let file;
        for (const [f, modified] of Object.entries(fieldsStatus)) {
            if (!modified) continue;
            if (f == "myfile") {
                file = document.getElementById(f).files[0];
                console.log(document.getElementById(f).files[0]);
            } else {
                modifiedFields[f] = document.getElementById(f).value;
            }
        }
        for (const [f, modified] of Object.entries(fieldsStatus2)) {
            if (!modified) continue;
            modifiedFields[f] = "true";
        }
        for (const [f, modified] of Object.entries(fieldsStatus3)) {
            if (!modified) continue;
            modifiedFields[f] = "true";
        }
        if (Object.keys(modifiedFields).length === 0) {} else {
            console.log("have modified fields");
            console.log(JSON.stringify(modifiedFields));
            fetch("http://127.0.0.1:5000/autosave/" + id, { method: "PATCH", body: JSON.stringify(modifiedFields), headers: send_headers, files: file  });
        }
        if (file) {
            console.log("update file");
            const formData = new FormData();
            formData.append('file', file);
            fetch("http://127.0.0.1:5000/savefile/" + id, { method: "POST", body: formData, headers: file_headers, files: file });
        }
    } else {
        console.log("go back");
    }
    window.location.href="https://mkn.edu/";
}

async function publishDraft() {
    const requiredElements = document.querySelectorAll("[required]");
    console.log(requiredElements);
    let flag = true;
    for (var i = 0; i < requiredElements.length; i++) {
        if (requiredElements[i].value.trim() === '') {
            flag = false;
            console.log(requiredElements[i]);
        }
    }
    if (flag) {
        await fetch("http://127.0.0.1:5000/publish/" + id, { method: 'POST', headers: send_headers })
            .then(_ => { window.location.href = "https://mkn.edu/"; });
    } else {
        alert("Please fill in all required fields (username, password, feedback).");
    }
}

async function dropDraft() {
    alert("Delete data");
    await fetch("http://127.0.0.1:5000/reset/" + id, { method: 'DELETE', headers: send_headers }).then(_ => { window.location.href = "https://mkn.edu/"; });
}
