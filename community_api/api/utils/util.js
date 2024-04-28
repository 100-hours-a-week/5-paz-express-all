module.exports = {
    getTime: () => {
        let now = new Date();

        let yy = now.getFullYear();
        let mm = ('0' + (now.getMonth() + 1)).slice(-2);
        let dd = ('0' + now.getDate()).slice(-2);
        let hh = ('0' + now.getHours()).slice(-2);
        let min = ('0' + now.getMinutes()).slice(-2);
        let ss = ('0' + now.getSeconds()).slice(-2);

        const time = `${yy}-${mm}-${dd} ${hh}:${min}:${ss}`
        return time;
    }
}