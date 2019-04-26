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
			rpcConfig: {},
			offerConfig: {},
			answerConfig: {},
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
				console.log(name);
				coordinator.getOfferByChannel(name, async function(data) {
					try {
						var scp = data.data.data;
						v.pcs.remote = new RTCPeerConnection(this.rpcConfig);
						v.pcs.remote.setRemoteDescription(scp);
						answer = await v.pcs.remote.createAnswer(this.answerConfig);
						v.pcs.remote.setLocalDescription(answer);
						coordinator.createAnswer(data.id, answer);
						v.pcs.remote.addEventListener('track', 
							function(e) {
								video = document.getElementById('media');
								if (video.srcObject !== e.streams[0]) {
									video.srcObject = e.streams[0];
									console.log('recieve remote stream');
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
			},

			async startStreaming() {
				var v = this;

				if (confirm("Start broadcasting your channel?")) {
					this.streaming = true;
					var pc = new RTCPeerConnection(this.rpcConfig);
					console.log('Initialize peer connection object');
					if (this.localStream == null) {
						this.streaming = false;
						alert("Local stream has not started, please try again");
					} else {
						this.localStream.getTracks().forEach(track => pc.addTrack(track, this.localStream));
						try {
							offer = await pc.createOffer(this.offerConfig);
							await pc.setLocalDescription(offer);
							
							this.channelName = prompt("Please enter your channel name", "Channel Name");
							coordinator.createOffer(this.channelName, offer,
								function(data) {
									v.offerIds.push(data.id);
									v.pcs[data.id] = pc;
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
				console.log(data.data);
				v.pcs[data.id].setRemoteDescription(data.data);
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
					v.onAcceptAnswer(data);
				});
			});
			await timeout(3000);
		}
	}

	syncChannel();
	acceptAnswer();
});
