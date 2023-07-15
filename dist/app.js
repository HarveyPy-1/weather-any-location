const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/")); // This line of code enabled my external css to work with the html.

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;
	const list_id = "e054891cd5";
	const server_no = "21"; // Gotten at the back of your API
	const url = `https://us${server_no}.api.mailchimp.com/3.0/lists/${list_id}`;
	const options = {
		method: "POST",
		auth: "any_string:035073a7b3b45256e21aa233f03a3270-us21",
	};

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			res.sendFile(`${__dirname}/success.html`);
		} else {
			res.sendFile(`${__dirname}/failure.html`);
		}
		response.on("data", (data) => {
			console.log(JSON.parse(data));
		});
	});
	request.write(jsonData);
	request.end();

	console.log(firstName, lastName, email);
});

app.post("/failure", (req, res) => {
	res.redirect("/");
});

app.listen(3000, () => {
	console.log("Server is running on port 3000...");
});

// API_KEY
// 035073a7b3b45256e21aa233f03a3270-us21

// Audience ID
// e054891cd5
