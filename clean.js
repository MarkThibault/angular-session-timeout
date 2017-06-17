const del = require("del");
del([
	"./dist",
    "./examples/dist",
    "./node_modules",
    "./typings"
]).then(paths => {
	console.log("Deleted files and folders:\n", paths.join("\n"));
});