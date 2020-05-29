function submit() {
    var selectedMode = document.getElementById('select');
    window.location.href = `/minesweeper-play/${selectedMode.value}`
}