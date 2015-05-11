var inputId = "3yhaeXemYygFhL628";
var inputFocusId = "vMRavMWiq8gqeykRg";
var currentControlId = "EyC7mddPcLyeWwW7t";
var backGroundColorId = "EyuLrBtFNGK34kZZJ";

//Account.UI.Configuration
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});

//Helper function
Template.sessionInfoPanel.users = function(){
	return UsersLogin.find();
}

Template.sessionInfoPanel.helpers({
	users: function(){
		return UsersLogin.find();
	},

	currentControl:  function(){
		var userID = this.userID;
		var currentControlID = GlobalInput.findOne({_id: currentControlId});
	
		if ((currentControlID != null) && (userID != null)){
			//console.log(userID);
			//console.log(currentControlID.controlUserId);
			if (currentControlID.controlUserID === userID) return true;
		}
		return false;
	},

	isController: function(){
		var userID = Session.get('userID');
		var currentControlID = GlobalInput.findOne({_id: currentControlId});
	
		if ((currentControlID != null) && (userID != null)){
			//console.log(userID);
			//console.log(currentControlID.controlUserId);
			if (currentControlID.controlUserID === userID) return true;
		}
		return false;
	},

	colorCode: function(){
		var userName = this.userName;
			if (userName == "User1") return "color-code-user1";
			if (userName == "User2") return "color-code-user2";
		
		return "";
	}
});

Template.sessionMainPanel.helpers({
	inputRepeat: function(){
		var inputs = GlobalInput.findOne(inputId);
		if (!inputs) return '';
		return inputs.inputRepeat;
	},

	inputDuration: function(){
		var inputs = GlobalInput.findOne(inputId);
		if (!inputs) return '';
		return inputs.inputDuration;
	},

	inputDistances: function(){
		var inputs = GlobalInput.findOne(inputId);
		if (!inputs) return '';
		return inputs.inputDistances;
	},

	repeatFocus: function(){
		var value = GlobalInput.findOne(inputFocusId);
		if(value && value.repeatFocus) return "focus-textform";
		return '';
	},

	durationFocus: function(){
		var value = GlobalInput.findOne(inputFocusId);
		if(value && value.durationFocus) return "focus-textform";
		return '';
	},

	distancesFocus: function(){
		var value = GlobalInput.findOne(inputFocusId);
		if(value && value.distancesFocus) return "focus-textform";
		return '';
	},

	disable: function(){
		var userID = Session.get('userID');
		var currentControlID = GlobalInput.findOne({_id: currentControlId});
	
		if ((currentControlID != null) && (userID != null)){
			//console.log(userID);
			//console.log(currentControlID.controlUserId);
			if (currentControlID.controlUserID === userID) return "";
		}
		return "disabled";
	},

	backgroundColor: function(){
		var isLogged = UsersLogin.find().fetch();
		console.log(isLogged.length);
		if (isLogged.length === 0) return "";
		var userID = GlobalInput.findOne({_id: currentControlId});
		if (userID) {
			if (userID.controlUserID === "SrXwTsh2k7J8KEGnu") return "background-user1";
			if (userID.controlUserID === "Ae8CCKjuRRvMEmvHY") return "background-user2";
		}
		return "";
		
	}

});


Template.chatBox.helpers({
	messages: function(){
		return Messages.find({},{sort: {time: -1}});
	},

	disable: function(){
		var userID = Session.get('userID');
		if (userID) return "";
		return "disabled";
	}
});

//Event handler for SessionInfoPanel
Template.sessionInfoPanel.events({
	'click button.pass-control-button': function(){
		console.log(this.userID);
		GlobalInput.update({_id: currentControlId},{$set: {controlUserID: this.userID}});
	}
});

//Event handler for Experiment Setup Form 
Template.sessionMainPanel.events({
	'keyup #repeatField': function(){
		var currentInput = document.getElementById("repeatField").value;
		GlobalInput.update(
			{_id: inputId},
			{$set: {inputRepeat: currentInput}}
		);
		console.log(currentInput);
	},

	'focus #repeatField': function(){
		console.log("focus");
		GlobalInput.update({_id: inputFocusId},{$set: {repeatFocus: true}});
	},

	'blur #repeatField': function(){
		console.log("outFocus");
		GlobalInput.update({_id: inputFocusId},{$set: {repeatFocus: false}});
	},

	'keyup #durationField': function(){
		var currentInput = document.getElementById("durationField").value;
		GlobalInput.update(
			{_id: inputId},
			{$set: {inputDuration: currentInput}}
		);
		console.log(currentInput);
	},

	'focus #durationField': function(){
		console.log("focus");
		GlobalInput.update({_id: inputFocusId},{$set: {durationFocus: true}});
	},

	'blur #durationField': function(){
		console.log("outFocus");
		GlobalInput.update({_id: inputFocusId},{$set: {durationFocus: false}});
	},

	'keyup #distancesField': function(){
		var currentInput = document.getElementById("distancesField").value;
		GlobalInput.update(
			{_id: inputId},
			{$set: {inputDistances: currentInput}}
		);
		console.log(currentInput);
	},

	'focus #distancesField': function(){
		console.log("focus");
		GlobalInput.update({_id: inputFocusId},{$set: {distancesFocus: true}});
	},

	'blur #distancesField': function(){
		console.log("outFocus");
		GlobalInput.update({_id: inputFocusId},{$set: {distancesFocus: false}});
	}
});

Template.chatBox.events({
	'click #sendButton': function(){
		var name = Session.get('userName');
		var mess = document.getElementById("textInput").value;
		Messages.insert({userName: name, message: mess});
		document.getElementById("textInput").value = "";
		

	}
});

//When User Login
Deps.autorun(function(){
	if (Meteor.user() != null) {
		var ID = Meteor.user()._id;
		var Name = Meteor.user().username;
		var primaryID = UsersLogin.insert({userID: ID, userName: Name});
		//console("daksd");
		Session.set('userID',ID);
		Session.set('userName',Name);
		Session.set('primaryID',primaryID);
		Session.set('logggedIn',true);
	} else{
		if(Session.get('logggedIn')) {
			UsersLogin.remove({_id: Session.get('primaryID')});
			Session.set('userID',null);
			Session.set('userName',null);
			Session.set('primaryID',null);
			Session.set('logggedIn',false);
		}
	}
});

//When User Logout
Meteor.logout(function(){
	
});
