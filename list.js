let headers = new Headers();
headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');

async function LoadList() {
    await fetch("http://127.0.0.1:5000/drafts", {headers: headers}).then(
        response => response.json()
    ).then(data => {
        console.log(data);
        for (const [uid, draft] of Object.entries(data)) {
            console.log(draft);
            const markup = `<li><a href="https://mkn.edu/draft.html?id=${uid}&pub=false">Draft for ${draft}</a> <input type="button" onclick="deleteDraft('${uid}');" value="delete"></input></li>`;
            document.querySelector('ul').insertAdjacentHTML("beforeend", markup);
        }
        document.querySelector('ul').insertAdjacentHTML("beforeend", `<hr>`);
    }).catch(err => console.log(err));

    await fetch("http://127.0.0.1:5000/publications", {headers: headers}).then(
        response => response.json()
    ).then(data => {
        console.log(data);
        for (const [uid, draft] of Object.entries(data)) {
            const markup = `<li><a href="https://mkn.edu/draft.html?id=${uid}&pub=true">Publication for ${draft}</a> <input type="button" onclick="deletePub('${uid}');" value="delete"></input></li>`;
            document.querySelector('ul').insertAdjacentHTML("beforeend", markup);
        }
    }).catch(err => console.log(err));
}

window.onload = async function () {
    await LoadList();
};

async function newDraft() {
    await fetch("http://127.0.0.1:5000/init", {headers: headers}).then(response => 
        response.json()
    ).then(data => {
        console.log(data);    
        window.location.href = "https://mkn.edu/draft.html?id=" + data.id;
    });
}

async function deleteDraft(uid){
    await fetch("http://127.0.0.1:5000/delete/"+uid, {method: "DELETE", headers: headers});
    location.reload();
}

async function deletePub(uid){
    await fetch("http://127.0.0.1:5000/deletepub/"+uid, {method: "DELETE", headers: headers});
    location.reload();
}
