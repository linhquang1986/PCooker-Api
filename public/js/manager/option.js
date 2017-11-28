var editOption = null;
var dataOption = null;

var submitFormOption = (form) => {
    let error = false;
    let data = $(form).serializeArray();
    let optionData = {
        value: null,
        question: null
    }
    //validate
    new Promise((resolve, reject) => {
        data.forEach(item => {
            if (item.value === "") {
                $(form).find('.error').html('Please complete information').show();
                error = true;
                setTimeout(() => {
                    $(form).find('.error').hide()
                }, 2000)
                return;
            } else {
                if (item.name == "value")
                    optionData.value = item.value
                if (item.name == "question")
                    optionData.question = item.value
            }
        });
        resolve(optionData)
    }).then(rs => {
        //if no error
        if (!error) {
            //check add or edit
            if (!editOption)
                post('/drink/addOption', optionData, (res) => {
                    clearForm(form);
                    getAllOption();
                })
            else {
                put('/drink/editOption/', editOption._id, optionData, (res) => {
                    clearForm(form);
                    getAllOption();
                })
            }
        }
    })
}
var delOption = (id) => {
    _delete('/drink/delOption/', id, (res) => {
        if (res.success)
            getAllOption();
    })
}
var renderTableOption = (data) => {
    let option = $('#tableOption');
    option.find('tbody').empty();
    for (let i = 0; i < data.length; i++) {
        let index = i + 1;
        let intent = `<tr index="${i}"><td>${index}</td><td>${data[i].value}</td><td>${data[i].question}</td><td><button onclick='delOption("${data[i]._id}")' class='btn btn-danger'>Del</button><td><tr>`
        option.append(intent);
    }
    //select row and bind data
    option.children('tbody').find('tr').click((e) => {
        if (e.target.localName === 'td') {
            let index = e.currentTarget.attributes[0].value;
            editOption = data[index]
            $('#optionValue').val(editOption.value);
            $('#question').val(editOption.question);
        }
    })
}
var getAllOption = () => {
    get('/drink/getAllOption', data => {
        dataOption = data;
        renderTableOption(data);
    })
}
getAllOption();