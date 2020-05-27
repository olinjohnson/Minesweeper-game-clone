exports.homePage = (req, res) => {
    res.render('start');
}
exports.play = (req, res) => {
    let m = req.params.mode;
    res.render('index', {mode:m});
}