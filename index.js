/* 
   lit-html snippet - Begin
   Add to the top of your code. Works with html or jsx!
   Formats html in a template literal  using the lit-html library 
   Syntax: html`<div> html or jsx here! ${variable} </div>`
*/
let html = (strings, ...values) => {
    let str = "";
    strings.forEach((string, i) => {
      str += string + (values[i] || "");
    });
    return str;
  };
  //lit-html snippet - End

/* Start of Pantheon Class */
class Pantheon {
    constructor(name) {
        this.name = name; //the name property for the pantheon object.
        this.gods = []; //this is an array that will hold the data for the indiviual god cards.
        //console.log(this.gods);
    }
      
    addGods(name, spouse, type, godOf) { //method for adding the gods content to the array.
        this.gods.push(new Gods(name, spouse, type, godOf));
    }
} /* end of Pantheon Class */
      
/* Start of Gods Class */
class Gods {
    constructor(name, spouse, type, godOf, id) {
        this.name = name;
        this.type = type;
        this.godOf = godOf;
        this.spouse = spouse;
        this.id = id; //used to give each instance of gods an id.
    }
} /* end of Gods Class */
      
/* Start of ApiRequestHandler Class */      
class ApiRequestHandler {
    //static methods are functions that belong to a class, rather than an instance of that class.
    static url = "https://64051b18eed195a99f7c3b5c.mockapi.io/pantheons"; //url address for my mockAPI with pantheons set as the endpoint.

    /* Start of getAllPantheon method */
    static getAllPantheon() {
        return $.get(this.url); //ajax get request to retrieve, search, or view existing entries
    }/* end of getAllPantheon method */
    
    /* Start of getPantheon method */
    static getPantheon(id) {
        return $.get(`${this.url}/${id}`); //get the id for pantheons from the api's url.
    } /* end of getPantheon method */
      
    /* Start of createPantheon method */
    static createPantheon(pantheon) {
         return $.post(this.url, pantheon); //post request to add new entries to the api.
    } /* end of createPantheon method */
      
    /* Start of updatePantheon method */
    static updatePantheon(pantheon) {
        //console.log(pantheon);
        return $.ajax({
            url: `${this.url}/${pantheon.id}`,
            dataType: "json",
            data: JSON.stringify(pantheon), //turns data into a json string.
            contentType: "application/json",
            type: "PUT" //put request to edit existing entries in the api.
        });
    } /* end of updatePantheon method */
    
    /* Start of deletePantheon method */ 
    static deletePantheon(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: "DELETE" //delete request to remove existing entries in the api.
        });
    }/* end of deletePantheon method */

} /* end of ApiRequestHandler Class */
     
/* Start of DOMManager Class */
class DOMManager { //object to reference all pantheons in the class.
    static pantheons;
     
    /* Start of getAllPantheon method */
    static getAllPantheon() { //method to call the getAllPanteon in the ApiRequestHandler class and render is to the DOM.
        ApiRequestHandler.getAllPantheon().then(pantheons => {
            this.render(pantheons)
            //console.log(pantheons);
        });
    } /* Start of getAllPantheon method */
    
    /* Start of deletePantheon method */      
    static deletePantheon(id) { //static method to delete an existing pantheon using ApiRequestHandler class and properties.
        ApiRequestHandler.deletePantheon(id)
        .then(() => {
            return ApiRequestHandler.getAllPantheon(); //then response to promise that accesses method to return all pantheons/render all data to the API
        })
        .then((pantheons) => this.render(pantheons)); //then response to promise that returns the pantheons in this class and calls render method below
    } /* end of deletePantheon method */
      
    /* Start of createPantheon method */
    static createPantheon(name) {
        ApiRequestHandler.createPantheon(new Pantheon(name))
        .then(() => {
            return ApiRequestHandler.getAllPantheon();
        })
        .then((pantheons) => this.render(pantheons));
    } /* Start of createPantheon method */

    /* Start of editGods method */
    static editGods(editPanId, editGodId) {
        //console.log(editPanId, editGodId);
        let mySaveBtn = document.getElementById('saveBtn');
        let mySaveData = {};
        //console.log(mySaveBtn);

        //mySave eventlistner - begin
        mySaveBtn.addEventListener('click', (e) => { //clicking the save btn should save the input text to the mySaveData array.
            e.preventDefault(); //prevents the page from reloading.
          let godNameInput = document.getElementById('god_name').value;
          let godSpouseInput = document.getElementById('spouse').value; //DOM element selector for id.
          let godTypeInput = document.getElementById('god_type').value;
          let godOfInput = document.getElementById('god-of').value;
          //console.log(godNameInput, godSpouseInput, godTypeInput, godOfInput);
          mySaveData = {name: godNameInput, type: godTypeInput, spouse: godSpouseInput, godOf: godOfInput, id: editGodId}; //needs id object to give the new content a value so it can be deleted later.
          //console.log(mySaveData);

            for(let pantheon of this.pantheons) {
                //console.log('pantheon data:', pantheon);
                if(pantheon.id == editPanId) {
                    //console.log("Pantheon id:", pantheon.id, "editPan Id:", editPanId);
                    for(let god of pantheon.gods) {
                        //console.log('what god:', god);
                        if(god.id == editGodId) {
                            // console.log("god id:", god.id, "god Id:", editGodId);
                            //console.log(god.id);
                            //console.log("this is gods array:", pantheon.gods);
                            pantheon.gods.splice(pantheon.gods.indexOf(god), 1, mySaveData); //splicing gods array and giving it a third value to override the selected element with mySaveData element.
                            //console.log("updated array:", pantheon.gods);
                                ApiRequestHandler.updatePantheon(pantheon)
                                .then(() => {
                                    return ApiRequestHandler.getAllPantheon();
                                })
                                .then((pantheons) => this.render(pantheons));
                        }
                    }
                }
            }
        })
    }/* end of editGods method */
      
    /* Start of addGods method */
    static addGods(id) {
        for (let pantheon of this.pantheons) {

            //console.log(pantheon);
            //console.log(this.pantheons);
        if (pantheon.id == id) {
            //console.log(pantheon.id);
            pantheon.gods.push(new Gods($(`#${pantheon.id}-god-name`).val(), //pushing new id and value to the gods array in the Pantheon class which is also updated in the api.
            $(`#${pantheon.id}-spouse`).val(), 
            $(`#${pantheon.id}-god-type`).val(), 
            $(`#${pantheon.id}-god-of`).val(),
            pantheon.gods.length)); //pushing the length of the gods array to give each god added an id that is dynmaic with the api.
            //console.log(pantheon.gods.length);
            //console.log(pantheon.gods);
            ApiRequestHandler.updatePantheon(pantheon) //using the updatePantheon and put request to update the api with the new gods content.
            .then(() => {
                return ApiRequestHandler.getAllPantheon();
            })
            .then((pantheons) => this.render(pantheons));
            }
        }
    } /* end of addGods method */
      
    /* Start of deleteGods method */
    static deleteGods(pantheonId, godsId) { //deleting elements from the gods array and from the api.
        for (let pantheon of this.pantheons) {
            if (pantheon.id == pantheonId) {
                for (let god of pantheon.gods) { //iterating through the gods array.
                    if (god.id == godsId) {
                        //console.log(god.id);
                        pantheon.gods.splice(pantheon.gods.indexOf(god), 1); //deleting element from the desired index and only one.
                        ApiRequestHandler.updatePantheon(pantheon)
                        .then(() => {
                            return ApiRequestHandler.getAllPantheon();
                        })
                        .then((pantheons) => this.render(pantheons));
                    }
                }
            }
        }
    } /* End of deleteGods method */
      
    /* Start of render method */
    static render(pantheons) {
        this.pantheons = pantheons;
         $("#app").empty(); //accessing the div that stores the information below and clears it before re-rendering.
        for (let pantheon of pantheons) {
            //console.log('render:', pantheon);
            $("#app").prepend(
            html`<div id="${pantheon.id}" class="card">
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
                $(`#${pantheon.id}`).find('.card-body1').append( //find method to locate the card-body1 class and put the content below after the current content.
                    html`<div class="card mx-2 mt-2 mb-2" id="innerCard">
                        <div class="card-body">
                            <h5 class="card-title" id="god-name-${god.id}">${god.name}</h5>
                                <p class="card-text">
                                <span id="god-spouse-${god.id}"><strong>Spouse:</strong> ${god.spouse}</span><br>
                                <span id="god-type-${god.id}"><strong>God Type:</strong> ${god.type}</span><br>
                                <span id="god-of-${god.id}"><strong>God Of:</strong> ${god.godOf}</span>
                                </p>
                            <button class="btn btn-outline-danger" onclick="DOMManager.deleteGods('${pantheon.id}', '${god.id}')">Delete</button>
                            <button class="btn btn-outline-info" id="editBtn" data-bs-toggle="modal" data-bs-target="#myModal" onclick="DOMManager.editGods('${pantheon.id}', '${god.id}')">Edit</button>
                        </div>
                    </div>`
                );
            }
        }
    } /* end of render method */
      
} /* end of DOMManager Class */
      
/* Start of jquery method to call the createPantheon method */
$('#create-pantheon').on('click', () => { //adds a new pantheon after clicking on the create button.
    DOMManager.createPantheon($('#pantheon-name').val());
    $('#pantheon-name').val(''); //clears the input field after clicking on the create button.
}); /* end of jquery method to call the createPantheon method */

/* start of method to clear modal input fields when closed */
$(document).ready(function() {
    $(".modal").on("hidden.bs.modal", function() {
      $("#god_name").val('');
      $("#spouse").val('');
      $("#god_type").val('');
      $("#god-of").val('');
    });
  }); /* end of method to clear modal input fields when closed */

DOMManager.getAllPantheon(); //calling the getAllPantheon function to run.