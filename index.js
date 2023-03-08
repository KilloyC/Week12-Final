/* TODO */
//create a way for users to
    //edit entries with a modal after clicking the edit button-not sure how to make this work.
//get the cards to display in a row and columns.

class Pantheon {
    constructor(name) {
        this.name = name;
        this.gods = [];
        //console.log(this.gods);
    }
      
    addGods(name, spouse, type, godOf) {
        this.gods.push(new Gods(name, spouse, type, godOf));
    }
} 
      
class Gods {
    static idCounter = 0;

    constructor(name, spouse, type, godOf) {
        this.name = name;
        this.type = type;
        this.godOf = godOf;
        this.spouse = spouse;
        this.id = Gods.idCounter++;
    }
}
      
      
class PantheonStorage {
    static url = "https://64051b18eed195a99f7c3b5c.mockapi.io/pantheons";

    static getAllPantheon() {
        return $.get(this.url);
    }
      
    static getPantheon(id) {
        return $.get(`${this.url}/${id}`);
    }
      
    static createPantheon(pantheon) {
         return $.post(this.url, pantheon);
    }
      
    static updatePantheon(pantheon) {
        return $.ajax({
            url: `${this.url}/${pantheon.id}`,
            dataType: "json",
            data: JSON.stringify(pantheon),
            contentType: "application/json",
            type: "PUT"
        });
    }
      
    static deletePantheon(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
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

    //need to find a way to get the api data to fill out the form, and to be able to edit it and save the chagnes.
    static editGods() {
        // $('#editBtn').on('click', () => {
        //     $('#myModal').modal('show');

        //     $.ajax({
        //         url: `${this.url}/${god.id}`,
        //         dataType: "json",
        //         data: JSON.stringify(god),
        //         contentType: "application/json",
        //         type: "PUT"
        //     })
        // })
    }
      
    static addGods(id) {
        for (let pantheon of this.pantheons) {
            //console.log(pantheon);
            //console.log(this.pantheons);
        if (pantheon.id == id) {
            //console.log(pantheon.id);
            pantheon.gods.push(new Gods($(`#${pantheon.id}-god-name`).val(),
            $(`#${pantheon.id}-spouse`).val(), 
            $(`#${pantheon.id}-god-type`).val(), 
            $(`#${pantheon.id}-god-of`).val()));
            //console.log(pantheon.gods);
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
                        //console.log(god.id);
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
                <button class="btn btn-outline-danger d-flex justify-content-center align-items-center m-auto" onclick="DOMManager.deletePantheon('${pantheon.id}')">Delete</button>
                </div>
                <div class="card-body1" id="main-card">
                    <div class="card">
                        <div class="row">
                            <div class="col-6">
                                God Name: <input type="text" id="${pantheon.id}-god-name" class="form-control">
                            </div>
                            <div class="col-6">
                                Spouse: <input type="text" id="${pantheon.id}-spouse" class="form-control">
                            </div>
                            <div class="col-6">
                                God Type: <input type="text" id="${pantheon.id}-god-type" class="form-control">
                            </div>
                            <div class="col-6">
                               God Of: <input type="text" id="${pantheon.id}-god-of" class="form-control">
                            </div>
                        </div>
                        <button id="${pantheon.id}-new-god" onclick="DOMManager.addGods('${pantheon.id}')" class="btn btn-warning mt-1 form-control">Add</button>
                    </div>
                </div>
            </div><br>`
            );
      
            for (let god of pantheon.gods) {
                $(`#${pantheon.id}`).find('.card-body1').append(
                    `<div class="card mx-2 mt-2 mb-2" id="innerCard">
                        <div class="card-body">
                            <h5 class="card-title">${god.name}</h5>
                                <p class="card-text">
                                <span id="god-spouse-${god.id}"><strong>Spouse:</strong> ${god.spouse}</span><br>
                                <span id="god-type-${god.id}"><strong>God Type:</strong> ${god.type}</span><br>
                                <span id="god-of-${god.id}"><strong>God Of:</strong> ${god.godOf}</span>
                                </p>
                            <button class="btn btn-outline-danger" onclick="DOMManager.deleteGods('${pantheon.id}', '${god.id}')">Delete</button>
                            <button class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#myModal" id="editBtn">Edit</button>
                        </div>
                    </div>`
                );
            }
        }
    }
      
}

// `<p>
// <span id="god-name-${god.id}"><strong>God Name:</strong> ${god.name}</span>
// <span id="god-type-${god.id}"><strong>God Type:</strong> ${god.type}</span>
// <span id="god-of-${god.id}"><strong>God Of:</strong> ${god.godOf}</span>
// <button class="btn btn-danger" onclick="DOMManager.deleteGods('${pantheon.id}', '${god.id}')">Delete</button></p>
// `
      
      
$('#create-pantheon').on('click', () => {
    DOMManager.createPantheon($('#pantheon-name').val());
    $('#pantheon-name').val('');
});

DOMManager.getAllPantheon();
    