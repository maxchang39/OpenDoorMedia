define(["jquery"], function($) {
	var http = {};
	
	http.createIceCandidate = function(name, data, callback) {
		$.ajax({
			url: "https://i9ew2l7r5c.execute-api.us-west-2.amazonaws.com/prod/ice",
			crossDomain: true,
			dataType: 'json',
			type: "POST",
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
				"name": name,
				"data": data
			}),
			success: function(data) {
				callback(data);
			},
			error: function(data) {
			}
		});
	}
	
	http.getIceByChannel = function(name, callback) {
		$.ajax({
			url: "https://i9ew2l7r5c.execute-api.us-west-2.amazonaws.com/prod/test",
			crossDomain: true,
			dataType: 'json',
			type: "GET",
			contentType: 'application/json; charset=utf-8',
			data: {
				"channel": name,
			},
			success: function(data) {
				callback(data);
			},
			error: function(data) {
			}
		});
	}

	http.createOffer = function(name, data, callback) {
		if (!name) {
			alert("name undefined");
			return;
		}

		if (!data) {
			alert("offer data is undefined");
			return;
		}

		$.ajax({
			url: "https://i9ew2l7r5c.execute-api.us-west-2.amazonaws.com/prod/channel",
			crossDomain: true,
			dataType: 'json',
			type: "POST",
			contentType: 'application/json; charset=utf-8',
			// dataType: 'jsonp',
			data: JSON.stringify({
				"name": name,
				"data": data
			}),
			success: function(data) {
				callback(data);
			},
			error: function(data) {
				alert("Error occurs");
			}
		});
	},

	http.getChannelList = function(callback) {
		$.ajax({
			url: "https://i9ew2l7r5c.execute-api.us-west-2.amazonaws.com/prod/names	",
			crossDomain: true,
			dataType: 'json',
			type: "Get",
			contentType: 'application/json; charset=utf-8',

			success: function(data) {
				callback(data);
			},

			error: function(data) {}
		});
	}

	http.getOfferByChannel = function(name, callback) {
		$.ajax({
			url: "https://i9ew2l7r5c.execute-api.us-west-2.amazonaws.com/prod/channel",
			crossDomain: true,
			dataType: 'json',
			type: "GET",
			contentType: 'application/json; charset=utf-8',
			data: {
				"channel": name,
			}	,

			success: function(data) {
				callback(data);
			},

			error: function(data) {},
		});
	}
	
	http.createAnswer = function(offerId, answer) {
		$.ajax({
			url: "https://i9ew2l7r5c.execute-api.us-west-2.amazonaws.com/prod/answer",
			crossDomain: true,
			dataType: 'json',
			type: "POST",
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
				"id": offerId,
				"data": answer
			}),
	
			success: function(data) {
			},
	
			error: function(data) {},
		});
	}
	
	http.getAnswerByOfferId = function(id, callback){
		$.ajax({
			url: "https://i9ew2l7r5c.execute-api.us-west-2.amazonaws.com/prod/answer",
			crossDomain: true,
			dataType: 'json',
			type: "GET",
			contentType: 'application/json; charset=utf-8',
			data: {
				"id": id
			},
	
			success: function(data) {
				callback(data);
			},
	
			error: function(data) {},
		});
	}
	
	// 	http.verifyUser = function(user_name, password, callback) {
	// 		if(!user_name) {
	// 			alert("user_name undefined");
	// 			return;
	// 		}
	// 
	// 		if(!password) {
	// 			alert("password undefined");
	// 			return;
	// 		}
	// 
	// 		$.ajax({
	// 			type: "POST",
	// 			url: "http://localhost:8080/teamin/user/verify",
	// 			contentType: 'application/json; charset=utf-8',
	// 			dataType: 'json',
	// 			data: JSON.stringify({
	// 				"username": user_name,
	// 				"password": password
	// 			}),
	// 			success: function(data, text) {
	// 				callback(data);
	// 				alert("user " + user_name + " has been successfully verified");
	// 			},
	// 			error: function(data) {
	// 				callback(false);
	// 				alert("Wrong combination of username or password");
	// 			}
	// 		});
	// 	}
	// 
	// 	http.getPartyTags = function(callback) {
	// 		$.ajax({
	// 			type: "GET",
	// 			url: "http://localhost:8080/teamin/party/tags",
	// 			contentType: 'application/json; charset=utf-8',
	// 			dataType: 'json',
	// 			data: "",
	// 			success: function(data, text) {
	// 				callback(data);
	// 			},
	// 			error: function(data) {
	// 				callback(false);
	// 			}
	// 		});
	// 	}
	// 
	// 	http.createParty = function(party, callback) {
	// 		$.ajax({
	// 			type: "POST",
	// 			url: "http://localhost:8080/teamin/party",
	// 			contentType: 'application/json; charset=utf-8',
	// 			dataType: 'json',
	// 			data: JSON.stringify(party),
	// 			success: function(data, text) {
	// 				alert("party " + party.name + " has been successfully created");
	// 			},
	// 			error: function(data) {}
	// 		});
	// 	}
	// 
	// 	http.searchParty = function(tag, keyword, callback) {
	// 		$.ajax({
	// 			type: "GET",
	// 			url: "http://localhost:8080/teamin/party?tag=" +
	// 				tag + "&keyword=" + keyword,
	// 			contentType: 'application/json; charset=utf-8',
	// 			dataType: 'json',
	// 			success: function(data, text) {
	// 				callback(data);
	// 			},
	// 			error: function(data) {}
	// 		});
	// 	}

	return http;
})
