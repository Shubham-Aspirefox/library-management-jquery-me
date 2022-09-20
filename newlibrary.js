

let tempData = "";

//onload createtable
$(document).ready(() => {
    if (localStorage.getItem('recList') != null) {
        if ($('#tbody').html() == "") {
            createTable();
        } else {
            $('#tbody').html("");
            createTable();
        }
    }
})


//onload jsondata 
$(document).ready(function () {
    $.getJSON("librarynew.json", function (data) {
        tempData = data;
        let headArr = Object.keys(tempData[0]);
        console.log(headArr);

        const cardDiv = $('#cardDiv');
        for (let i = 0; i < tempData.length; i++) {
            const card = $('<div class="card  m-1"  style="width:  align-content-start ;"></div>');
            const imgC = $("<img>");
            imgC.attr({
                class: "card-img-top shadow",
                src: `${tempData[i].ImageUrl}`,
                style: "width: 14rem; height: 250px;"
            })
            const cardBody = $('<div></div>');
            cardBody.attr("class", "card-body text-dark fst-italic shadow  pt-2 pb-2 bg-light");
            const p1 = $(`<p class="card-text fs-5">Name: ${tempData[i].Name} </P>`);
            const p2 = $(`<p class="card-text fs-5">Genre: ${tempData[i].Genre} </P>`);
            // const p4 = $(`<p class="card-text fs-5">Available Qty: ${tempData[i].QuantityAvailable} </P>`);
            const p5 = $(`<p class="card-text fs-5">Book Price: ${tempData[i].Price} </P>`);
            cardBody.append(p1);
            cardBody.append(p2);
            // cardBody.append(p4);
            cardBody.append(p5);
            card.append(imgC)
            card.append(cardBody);
            cardDiv.append(card);
        }

    }).fail(function () {
        console.log("file not found.");
    });
})

//Show borrower modal Add borrower section
$('#showModal').click(function () {
    $('#dob').change(function () {
         for (let i = 0; i < tempData.length; i++) {
            if (calAge($('#dob').val()) >= 10 && calAge($('#dob').val()) < 13) {
                if (tempData[i].Genre != "Horror") {
                    const opt = $(`<option></option>`);
                    opt.attr({
                        value: `${tempData[i].Name}`,
                    });
                    opt.text(`${tempData[i].Name}`);
                    $('#selectBook').append(opt)
                }
            } else {
                const opt = $(`<option></option>`);
                opt.attr({
                    value: `${tempData[i].Name}`,
                });
                opt.text(`${tempData[i].Name}`);
                $('#selectBook').append(opt)
            }
        }
    })


    $('#selectBook').change(() => {
        $('#priceCal').text(findPrice($('#selectBook').val()))
    })
    //click submit button
    $('#saveBtn').click(function () {
        let newObj = {};
        let theadArr = ["name", "phoneNo", "dob", "address", "selectBook", "totalPrice"];
        for (let i = 0; i < 6; i++) {
            if (i == 4) {
                if ($(`#${theadArr[i]}`).val() != "") {
                    let newArr = [];
                    newArr.unshift($(`#${theadArr[i]}`).val())
                    newObj[theadArr[i]] = newArr;
                } else {
                    return
                }
            } else if (i == 5) {

                if ($('#selectBook').val() != "") {
                    let price = findPrice($('#selectBook').val());
                    console.log(price);
                    newObj["totalPrice"] = price
                } else {
                    return;
                }
            } else {
                if ($(`#${theadArr[i]}`).val() != "") {
                    newObj[theadArr[i]] = $(`#${theadArr[i]}`).val();
                } else {
                    return;
                }
            }
        }
        //create table
        if (localStorage.getItem('recList') == null) {
            let newData = [];
            //create table
            newData.unshift(newObj);
            localStorage.setItem('recList', JSON.stringify(newData));
            console.log(JSON.parse(localStorage.getItem('recList')));
            if ($('#tbody').html() == "") {
                createTable();
            } else {
                $('#tbody').html("");
                createTable();
            }
        } else {
            let currRec = JSON.parse(localStorage.getItem('recList'))
            currRec.unshift(newObj);
            localStorage.setItem('recList', JSON.stringify(currRec));
            if ($('#tbody').html() == "") {
                createTable();
            } else {
                $('#tbody').html("");
                createTable();
            }
        }
    });

    // validation form
    $("#addBorrowerForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            phoneNo: {
                required: true,
                number: true,
                minlength: 10
            },
            dob: {
                required: true
            },
            address: {
                required: true
            },
            selectBook: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please enter you name",
                minlength: "length of name must be 2"
            },
            phoneNo: {
                required: "please enter you 10 digit mobile no.",
                minlength: "Enter valid mob no.",
                number: "mobile no. shoud be in numeric"
            },
            dob: {
                required: "Please enter you date of birth"
            },
            address: {
                required: "Please enter your resident address"
            },
            selectBook: {
                required: "please select a book."
            }
        }
    });
});

//calTotalPrice
function findPrice(str) {
    for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].Name == str) {
            return tempData[i].Price;
        }
    }
}

//create table
function createTable() {
    let localData = JSON.parse(localStorage.getItem('recList'));
    let headerArr = Object.keys(localData[0]);
    for (let i = 0; i < localData.length; i++) {
        const row = $('<tr></tr>');
        row.attr({
            id: `${localData[i].name}`
        });
        for (let j = 0; j < headerArr.length; j++) {
            const td = $('<td></td>');
            td.text(localData[i][headerArr[j]]);
            row.append(td);
        }
        //return and add btn
        const actRow = $('<td></td>')
        const rtnBtn = $('<button class="bg-success border-0 rounded-5 text-light" id="rtnModal">Return <i class="fa-solid fa-rotate-left"></i></button>');
        rtnBtn.attr('onclick', 'returnBookFun(this)')
        const addBookBtn = $('<button class="bg-danger border-0 rounded-5 text-light" id="addBookButton">Add Book <i class="fa-sharp fa-solid fa-circle-plus"></i></button>');
        addBookBtn.attr("onclick", "addBookFunction(this)")
        actRow.append(rtnBtn);
        actRow.append(addBookBtn);
        row.append(actRow);
        $('#tbody').append(row);
    }
    $('#myTable').DataTable();
}


//click add book button
function addBookFunction(e) {
    $('#addBook').modal('show');
    let bookList = tempData;
    let targetRow = $(e).parent().parent().attr("id");
    let tempRec = JSON.parse(localStorage.getItem('recList'));

    $('#selectAddBook').empty();
    for (let j = 0; j < bookList.length; j++) {
        let optionB = $(`<option value="${bookList[j].Name}"></option`);
        optionB.text(bookList[j].Name);
        $('#selectAddBook').append(optionB);
    }
    $('#selectAddBook').change(() => {
        $('#bKPrice').text(findPrice($('#selectAddBook').val()))
    })

    //click book button
    $('#addBook1').click(() => {
        console.log('clicked');
        // debugger;
        for (let i = 0; i < tempRec.length; i++) {
            if (tempRec[i].name == targetRow) {
                let bookArr = tempRec[i].selectBook;
                let newBook = $('#selectAddBook').val();
                //todo
                bookArr.unshift(newBook)
                tempRec[i].selectBook = bookArr;

                let bookcost = tempRec[i].totalPrice;
                let currBkPrice = findPrice($('#selectAddBook').val());
                let newp = bookcost + currBkPrice;
                tempRec[i].totalPrice = newp
                localStorage.setItem('recList', JSON.stringify(tempRec));
                //update table
                if ($('#tbody').html() == "") {
                    createTable();
                } else {
                    $('#tbody').html("");
                    createTable();
                }
            }
        }
        $('#addBook').modal('hide');
    })


}

let newTotalPrice = 0;
//return modal funciton
function returnBookFun(e) {
    $('#returnBook').modal('show');
    let tempRec = JSON.parse(localStorage.getItem('recList'));
    let bookList = tempData;
    let targetRow = $(e).parent().parent().attr("id");
    // console.log('row', targetRow);
    for (let i = 0; i < tempRec.length; i++) {
        if (tempRec[i].name == targetRow) {
            let bookArr = tempRec[i].selectBook;
            // console.log("books",bookArr);
            // $('#selectReturnBook').empty();
            for (let j = 0; j < bookArr.length; j++) {
                const opt = $('<option></option>')
                opt.val(`${bookArr[j]}`);
                opt.text(`${bookArr[j]}`);
                $('#selectReturnBook').append(opt);
            }
            //update price
            $('#selectReturnBook').change(() => {

                let totalCost = parseInt(tempRec[i].totalPrice);

                // console.log('book changed');
                // console.log("cost",totalCost);
                let currBookPrice = findPrice($('#selectReturnBook').val());
                console.log("bk price", currBookPrice);
                let newPrice = parseInt(totalCost - currBookPrice);
                // console.log("new p",newPrice);
                $('#rtnPrice').text(newPrice);

            })
        }
    }

    $('#returnBtn').click(() => {
        for (let i = 0; i < tempRec.length; i++) {
            if (tempRec[i].name == targetRow) {
                let nbookList = tempRec[i].selectBook;
                let currBook = $('#selectReturnBook').val();
                // console.log("curr brr", currBook);
                // debugger;
                for (let j = 0; j < nbookList.length; j++) {
                    if (nbookList[j] == currBook) {
                        nbookList.splice(j, 1);
                    }
                    tempRec[i].selectBook = nbookList;
                    let ntotalPrice = parseInt($('#rtnPrice').text());
                    // debugger
                    tempRec[i].totalPrice = ntotalPrice;
                    //update table
                    localStorage.setItem('recList', JSON.stringify(tempRec));
                    if ($('#tbody').html() == "") {
                        createTable();
                    } else {
                        $('#tbody').html("");
                        createTable();
                    }
                }
            }
        }

        $('#returnBook').modal('hide');
    })
}

// Calculate age
function calAge(str) {
    let year = new Date(str).getFullYear();
    let today = new Date().getFullYear();
    return today - year;
}

