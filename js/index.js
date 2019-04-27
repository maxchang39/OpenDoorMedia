define(['vue', 'common', "jquery", "coordinator"], function(Vue, common, $, coordinator) {
	common.test();

	var v = new Vue({
		el: "#main",
		data: {
			constraints: {
				audio: false,
				video: true
			},
			playing: false,
			streaming: false,
			localStream: null,
			track: null,
			channelName: "",
			channels: {},
			offerIdInput: 1383,
			offerIds: [],
			pcs: [],
			offers: {},
			leftTopIndication: "No Source",
			rpcConfig: {
				iceServers: [{
						urls: 'stun:stun.l.google.com:19302'
					},
					{
						urls: 'stun:global.stun.twilio.com:3478?transport=udp'
					}
				],
				sdpSemantics: 'unified-plan'
			},
			offerConfig: {
				offerToReceiveVideo: 1
			},
			answerConfig: {},
			connectedChannel: "",
		},

		methods: {
			async start(e) {
				try {
					const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
					this.handleSuccess(stream);
					this.playing = true;
				} catch (e) {
					this.handleError(e);
				}
			},

			async connect(name) {
				v = this;
				v.connectedChannel = name;
				console.log(name);
				v.syncIces(name);

				coordinator.getOfferByChannel(name, async function(data) {
					try {
						var scp = data.data.data;
						console.log(scp);
						v.pcs.local.setRemoteDescription(scp);
						answer = await v.pcs.local.createAnswer(this.answerConfig);
						await v.pcs.local.setLocalDescription(answer);
						coordinator.createAnswer(data.id, answer);
						v.pcs.local.addEventListener('track',
							function(e) {
								video = document.getElementById('media');
								alert("hello world!")
								if (video.srcObject !== e.streams[0]) {
									video.srcObject = e.streams[0];
									console.log('recieve remote stream');
									v.leftTopIndication = "Live";
								}
							}
						);
					} catch (e) {
						console.log(e);
					}
				});
			},

			stop() {
				track.stop();
				this.playing = false;
				video.srcObject = null;
				this.localStream = false;
				this.
				leftTopIndication = "No Source"
			},

			async startStreaming() {
				var v = this;

				if (confirm("Start broadcasting your channel?")) {
					this.streaming = true;
					console.log('Initialize peer connection object');
					if (this.localStream == null) {
						this.streaming = false;
						alert("Local stream has not started, please try again");
					} else {
						// this.localStream.getTracks().forEach(track => v.pcs.local.addTrack(track, this.localStream));
						v.pcs.local.addTrack(this.localStream.getTracks()[0], this.localStream);
						try {
							offer = await v.pcs.local.createOffer(this.offerConfig);
							await v.pcs.local.setLocalDescription(offer);

							this.channelName = prompt("Please enter your channel name", "Channel Name");
							// v.syncIces(v.channelName);

							coordinator.createOffer(this.channelName, offer,
								function(data) {
									v.offerIds.push(data.id);
									v.offers[data.id] = offer;
								});
						} catch (e) {
							console.log(e);
						}
					}
				}
			},

			setOfferId(e) {
				this.offerIds = [this.offerIdInput];
				console.log(this.offerIds);
				window.alert("Offer Id is set to " + this.offerIdInput);
			},

			stopStreaming() {
				this.streaming = false;
			},

			onAcceptAnswer(data) {
				v = this;
				v.pcs.local.setRemoteDescription(new RTCSessionDescription(data.data));
				console.log("Connection done, ready to broadcast");
			},

			handleSuccess(stream) {
				video = document.getElementById('media');
				track = stream.getVideoTracks()[0];
				video.srcObject = stream;
				this.localStream = stream;
			},

			handleError(error) {
				if (error.name === 'ConstraintNotSatisfiedError') {
					let v = constraints.video;
					errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
				} else if (error.name === 'PermissionDeniedError') {
					errorMsg('Permissions have not been granted to use your camera and ' +
						'microphone, you need to allow the page access to your devices in ' +
						'order fo	r the demo to work.');
				}
				console.log(`getUserMedia error: ${error.name}`, error);
			},

			async onIceCandidate(pc, event) {
				if (v.connectedChannel == "") {
					try {
						coordinator.createIceCandidate(v.channelName, event.candidate, function() {});
					} catch (e) {
						console.log("create ice failed on local name");
					}
				}
				//console.log(`${this.getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
			},

			onIceStateChange(pc, event) {
				if (pc) {
					console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
					console.log('ICE state change event: ', event);
				}
			},

			onAddIceCandidateError(pc, error) {
				console.log(`${this.getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
			},

			async syncIces(name) {
				while (true) {
// 					if (v.connectedChannel == "") {
// 						name = "4321";
// 					} else {
// 						name = "1234";
// 					}
					console.log(name);
					
					coordinator.getIceByChannel(name, function(data) {
						data.forEach(function(ice) {
							console.log(ice.data.data);
							v.pcs.local.addIceCandidate(ice.data.data);
						});
					});
					await timeout(10000);
				}
			},

			getName(pc) {
				return "Peer"
			}
		}
	});

	function timeout(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function syncChannel() {
		while (true) {
			console.log('Get me the channels');
			coordinator.getChannelList(function(data) {
				v.channels = data.channels;
			});
			await timeout(3000);
		}
	}

	async function acceptAnswer() {
		while (true) {
			console.log('Get me the answers for my offer');
			v.offerIds.forEach(async function(id) {
				coordinator.getAnswerByOfferId(id, function(data) {
					console.log(data);
					if(data.data != undefined) {
						console.log("Aceept new answer");
						v.onAcceptAnswer(data);
					} else {
						console.log("No answer available");
					}
				});
			});
			await timeout(5000);
		}
	}

	v.pcs.local = new RTCPeerConnection(v.rpcConfig);
 	v.pcs.local.addEventListener('icecandidate', e => v.onIceCandidate(v.pcs.local, e));
 	v.pcs.local.addEventListener('iceconnectionstatechange', e => v.onIceStateChange(v.pcs.local, e));

	syncChannel();
	acceptAnswer();
});
