const EventEmmitter = require('events');

class DB extends EventEmmitter{
    db_data = [
        {id: 1, name: 'Kto to', bday: '01-10-2010'},
        {id: 2, name: 'Nekto', bday: '20-02-2020'},
        {id: 3, name: 'Nikto', bday: '03-03-2003'},
        {id: 4, name: 'Iea', bday: '07-08-2004'},
    ];

    async select() {
        return new Promise((res, rej) => {
            res(this.db_data);
        });
    };
    async insert(elem) {
        return new Promise((res, rej) => {
            let elemId = this.db_data.findIndex(el => el.id == elem.id);
            if (elemId === -1) {
                this.db_data.push(elem);
                res(elem);
            } else {
                rej(getError("This id exist: " + elem.id));
            }
        })
    };
    async update(elem){
        return new Promise((res, rej)=>{
            let elemId = this.db_data.findIndex(el => el.id == elem.id);
            if(elemId !== -1){
                this.db_data[elemId] = elem;
                resolve(elem);
            }
            else{
                PromiseRejectionEvent(getError('This id is empty' + elemId));
            }
        })
    }
    async delete(id) {
        return new Promise((res, rej) => {
            let elemId = this.db_data.findIndex(el => el.id == id);
            if (elemId !== -1) {
                this.db_data.splice(elemId, 1);
                res(id);
            } else {
                rej(createError("Id is empty: " + id));
            }
        });
    }
}

const getError = (mess) => {
    return {
        error: mess
    }
}

module.exports.DB = DB;