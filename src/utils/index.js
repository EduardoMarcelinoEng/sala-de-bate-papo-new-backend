module.exports = {
    validateRoomURL(str){
        if(typeof str !== "string") return false;
        if(/\-\//.test(str)) return false;
        if(/\/\-/.test(str)) return false;
        if(/\/\//.test(str)) return false;
        if(/\-\-/.test(str)) return false;
        if(!/^(\/([a-z0-9\-])*)*$/.test(str)) return false;

        return true;
    }
}