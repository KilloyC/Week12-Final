//find an API and use ajax to interact with it
//create a form
//create a way for users to
    //be able to add entires
    //update entries
    //delete entries

class Pantheon {
    constructor(name) {
        this.name = name;
        this.gods = [];
        //console.log(this.gods);
    }
      
    addGods(name, status, godOf) {
        this.gods.push(new Gods(name, status, godOf));
    }
} 
      
class Gods {
    constructor(name, status, godOf) {
        this.name = name;
        this.status = status;
        this.godOf = godOf;
    }
}
      
      
class PantheonStorage {
    static url = "https://64051b18eed195a99f7c3b5c.mockapi.io/pantheons";

    static getAllPantheon() {
        return $.get(this.url);
    }
      
    static getPantheon(id) {
        return $.get(this.url + `/${id}`);
    }
      
    static createPantheon(pantheon) {
         return $.post(this.url, pantheon);
    }
      
    static updatePantheon(pantheon) {
        return $.ajax({
            url: this.url + `/${pantheon.id}`,
            dataType: "json",
            data: JSON.stringify(pantheon),
            contentType: "application/json",
            type: "PUT"
        });
    }
      
    static deletePantheon(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}
      
class DOMManager {
    static pantheons;
      
    static getAllPantheon() {
        PantheonStorage.getAllPantheon().then(pantheons => this.render(pantheons));
    }
          
    static deletePantheon(id) {
        PantheonStorage.deletePantheon(id)
        .then(() => {
            return PantheonStorage.getAllPantheon();
        })
        .then((pantheons) => this.render(pantheons));
    }
      
    static createPantheon(name) {
        PantheonStorage.createPantheon(new Pantheon(name))
        .then(() => {
            return PantheonStorage.getAllPantheon();
        })
        .then((pantheons) => this.render(pantheons));
    }
      
    static addGods(id) {
        for (let pantheon of this.pantheons) {
            console.log(this.pantheons);
        if (pantheon.id == id) {
            console.log(pantheon.id);
            pantheon.gods.push(new Gods($(`#${pantheon.id}-god-name`).val(), $(`#${pantheon.id}-god-status`).val(), $(`#${pantheon.id}-god-of`).val()));
            console.log(pantheon.gods);
            PantheonStorage.updatePantheon(pantheon)
            .then(() => {
                return PantheonStorage.getAllPantheon();
            })
            .then((pantheons) => this.render(pantheons));
            }
        }
    }
      
    static deleteGods(pantheonId, godsId) {
        for (let pantheon of this.pantheons) {
            if (pantheon.id == pantheonId) {
                for (let god of pantheon.gods) {
                    if (god.id == godsId) {
                        pantheon.gods.splice(pantheon.gods.indexOf(god), 1);
                        PantheonStorage.updatePantheon(pantheon)
                        .then(() => {
                            return PantheonStorage.getAllPantheon();
                        })
                        .then((pantheons) => this.render(pantheons));
                    }
                }
            }
        }
    }
      
    static render(pantheons) {
        this.pantheons = pantheons;
         $("#app").empty();
        for (let pantheon of pantheons) {
            $("#app").prepend(
            `<div id="${pantheon.id}" class="card">
                <div class="card-header">
                    <h2 class="text-center">${pantheon.name}</h2>
                <button class="btn btn-danger d-flex justify-content-center align-items-center m-auto" onclick="DOMManager.deletePantheon('${pantheon.id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${pantheon.id}-god-name" class="form-control" placeholder="God Name">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${pantheon.id}-god-status" class="form-control" placeholder="God Status">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${pantheon.id}-god-of" class="form-control" placeholder="God Of">
                            </div>
                        </div>
                        <button id="${pantheon.id}-new-volunteer" onclick="DOMManager.addGods('${pantheon.id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
            </div><br>`
            );
      
            for (let god of pantheon.gods) {
                $(`#${pantheon.id}`).find(".card-body").append(
                  `<p>
                  <span id="god-name-${god.id}">God Name: ${god.name}</span>
                  <span id="god-status-${god.id}">God Status: ${god.status}</span>
                  <span id="god-of-${god.id}">God Of: ${god.godOf}</span>
                  <button class="btn btn-danger" onclick="DOMManager.deleteGods('${pantheon.id}', '${god.id}')">Delete</button></p>
                  `
                );
            }
        }
    }
      
}
      
$("#create-pantheon").click(() => {
    DOMManager.createPantheon($("#pantheon-name").val());
    $("pantheon-name").val("");
});
      
DOMManager.getAllPantheon();
    