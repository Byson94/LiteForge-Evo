function theme(value) {
    if (value === true) {
        let existingData = localStorage.getItem("engine-plugin-DAT");
        existingData = existingData ? JSON.parse(existingData) : {};
        existingData.theme = true;
        localStorage.setItem("engine-plugin-DAT", JSON.stringify(existingData));
    } else {
        return;
    }
}

export { theme };